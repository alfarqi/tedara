<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Upload\StoreUploadRequest;
use App\Jobs\ProcessImageUpload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends BaseController
{
    /**
     * Upload a single file.
     */
    public function store(StoreUploadRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');
            $type = $request->input('type');
            $folder = $request->input('folder', $type);
            
            // Generate unique filename
            $filename = $this->generateUniqueFilename($file);
            
            // Determine storage path
            $path = $this->getStoragePath($type, $folder, $filename);
            
            // Store file
            $storedPath = Storage::disk('public')->putFileAs(
                dirname($path),
                $file,
                basename($path)
            );
            
            if (!$storedPath) {
                return $this->errorResponse('Failed to upload file', 500);
            }
            
            // Get public URL
            $url = Storage::disk('public')->url($storedPath);
            
            // Dispatch job for image processing (if it's an image)
            if (in_array($file->getClientMimeType(), ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])) {
                ProcessImageUpload::dispatch($storedPath, $type);
            }
            
            return $this->successResponse([
                'url' => $url,
                'path' => $storedPath,
                'filename' => $filename,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ], 'File uploaded successfully');
            
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to upload file: ' . $e->getMessage());
        }
    }

    /**
     * Upload multiple files.
     */
    public function storeMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'files.*' => 'required|file|mimes:jpeg,jpg,png,gif,webp|max:10240',
            'type' => 'required|in:product,store,user,general',
            'folder' => 'nullable|string|max:100',
        ]);

        try {
            $files = $request->file('files');
            $type = $request->input('type');
            $folder = $request->input('folder', $type);
            
            $uploadedFiles = [];
            
            foreach ($files as $file) {
                $filename = $this->generateUniqueFilename($file);
                $path = $this->getStoragePath($type, $folder, $filename);
                
                $storedPath = Storage::disk('public')->putFileAs(
                    dirname($path),
                    $file,
                    basename($path)
                );
                
                if ($storedPath) {
                    $url = Storage::disk('public')->url($storedPath);
                    
                    $uploadedFiles[] = [
                        'url' => $url,
                        'path' => $storedPath,
                        'filename' => $filename,
                        'size' => $file->getSize(),
                        'mime_type' => $file->getClientMimeType(),
                    ];
                    
                    // Process image if applicable
                    if (in_array($file->getClientMimeType(), ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])) {
                        ProcessImageUpload::dispatch($storedPath, $type);
                    }
                }
            }
            
            return $this->successResponse([
                'files' => $uploadedFiles,
                'count' => count($uploadedFiles),
            ], 'Files uploaded successfully');
            
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to upload files: ' . $e->getMessage());
        }
    }

    /**
     * Delete uploaded file.
     */
    public function destroy(Request $request, string $filename): JsonResponse
    {
        try {
            $path = $request->input('path');
            
            if (!$path) {
                return $this->errorResponse('File path is required', 400);
            }
            
            // Check if file exists
            if (!Storage::disk('public')->exists($path)) {
                return $this->notFoundResponse('File not found');
            }
            
            // Delete file
            $deleted = Storage::disk('public')->delete($path);
            
            if (!$deleted) {
                return $this->errorResponse('Failed to delete file', 500);
            }
            
            return $this->successResponse(null, 'File deleted successfully');
            
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete file: ' . $e->getMessage());
        }
    }

    /**
     * Generate unique filename.
     */
    private function generateUniqueFilename($file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $name = Str::slug($name);
        
        return $name . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    /**
     * Get storage path for file.
     */
    private function getStoragePath(string $type, string $folder, string $filename): string
    {
        $year = date('Y');
        $month = date('m');
        
        return "uploads/{$type}/{$folder}/{$year}/{$month}/{$filename}";
    }
}
