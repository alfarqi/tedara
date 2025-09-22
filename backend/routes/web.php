<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// File serving route for GoDaddy
Route::get('/serve-file/{path}', function (Request $request, $path) {
    // Security: Only allow certain file types
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx'];
    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    
    if (!in_array($extension, $allowedExtensions)) {
        abort(403, 'File type not allowed');
    }
    
    // Security: Only allow certain paths
    $allowedPaths = ['uploads/', 'images/', 'documents/'];
    $pathAllowed = false;
    
    foreach ($allowedPaths as $allowedPath) {
        if (strpos($path, $allowedPath) === 0) {
            $pathAllowed = true;
            break;
        }
    }
    
    if (!$pathAllowed) {
        abort(403, 'Path not allowed');
    }
    
    // Check if file exists
    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'File not found');
    }
    
    // Get file content
    $fileContent = Storage::disk('public')->get($path);
    $mimeType = Storage::disk('public')->mimeType($path);
    
    // Set headers
    $response = response($fileContent, 200);
    $response->header('Content-Type', $mimeType);
    $response->header('Cache-Control', 'public, max-age=31536000');
    $response->header('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
    
    return $response;
})->where('path', '.*');