<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessImageUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutes
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $imagePath,
        public string $type
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("Processing image upload", [
                'path' => $this->imagePath,
                'type' => $this->type
            ]);

            // Check if file exists
            if (!Storage::disk('public')->exists($this->imagePath)) {
                Log::error("Image file not found", ['path' => $this->imagePath]);
                return;
            }

            // Get file info
            $fileInfo = pathinfo($this->imagePath);
            $extension = strtolower($fileInfo['extension']);

            // Only process image files
            if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                Log::info("Skipping non-image file", ['path' => $this->imagePath]);
                return;
            }

            // TODO: Implement image optimization
            // This could include:
            // - Resizing images to different dimensions
            // - Compressing images
            // - Creating thumbnails
            // - Converting to WebP format
            // - Adding watermarks

            // For now, just log the processing
            Log::info("Image processing completed", [
                'path' => $this->imagePath,
                'type' => $this->type,
                'size' => Storage::disk('public')->size($this->imagePath)
            ]);

        } catch (\Exception $e) {
            Log::error("Image processing failed", [
                'path' => $this->imagePath,
                'error' => $e->getMessage()
            ]);

            // Re-throw the exception to trigger retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Image processing job failed permanently", [
            'path' => $this->imagePath,
            'type' => $this->type,
            'error' => $exception->getMessage()
        ]);
    }
}
