<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendEmailNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60; // 1 minute
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $email,
        public string $subject,
        public string $message,
        public ?string $template = null,
        public array $data = []
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("Sending email notification", [
                'email' => $this->email,
                'subject' => $this->subject,
                'template' => $this->template
            ]);

            // Check if we should use a template or send raw email
            if ($this->template) {
                // Send using a mail template
                Mail::send($this->template, $this->data, function ($message) {
                    $message->to($this->email)
                            ->subject($this->subject);
                });
            } else {
                // Send raw email
                Mail::raw($this->message, function ($message) {
                    $message->to($this->email)
                            ->subject($this->subject);
                });
            }

            Log::info("Email notification sent successfully", [
                'email' => $this->email,
                'subject' => $this->subject
            ]);

        } catch (\Exception $e) {
            Log::error("Email notification failed", [
                'email' => $this->email,
                'subject' => $this->subject,
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
        Log::error("Email notification job failed permanently", [
            'email' => $this->email,
            'subject' => $this->subject,
            'error' => $exception->getMessage()
        ]);
    }
}
