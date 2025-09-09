<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Product;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $timeout = 60;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Product $product,
        public int $currentStock,
        public int $threshold = 10
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Low Stock Alert - ' . $this->product->name)
            ->greeting('Low Stock Alert!')
            ->line('A product is running low on stock and requires your attention.')
            ->line('Product Details:')
            ->line('Name: ' . $this->product->name)
            ->line('SKU: ' . $this->product->sku)
            ->line('Current Stock: ' . $this->currentStock)
            ->line('Threshold: ' . $this->threshold)
            ->line('Category: ' . ($this->product->category->name ?? 'N/A'))
            ->action('View Product', url('/admin/products/' . $this->product->id))
            ->line('Please restock this product to avoid stockouts.')
            ->line('Thank you for using our platform!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'sku' => $this->product->sku,
            'current_stock' => $this->currentStock,
            'threshold' => $this->threshold,
            'category' => $this->product->category->name ?? null,
        ];
    }
}
