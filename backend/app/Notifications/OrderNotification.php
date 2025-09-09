<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class OrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $timeout = 60;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Order $order,
        public string $type = 'new_order'
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
        $subject = $this->getSubject();
        $greeting = $this->getGreeting();
        $content = $this->getContent();

        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($content)
            ->line('Order Details:')
            ->line('Order ID: ' . $this->order->order_id)
            ->line('Customer: ' . $this->order->customer->name)
            ->line('Total: ' . number_format($this->order->total, 2) . ' SAR')
            ->line('Status: ' . ucfirst($this->order->status))
            ->action('View Order', url('/admin/orders/' . $this->order->id))
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
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_id,
            'type' => $this->type,
            'customer_name' => $this->order->customer->name,
            'total' => $this->order->total,
            'status' => $this->order->status,
        ];
    }

    /**
     * Get notification subject based on type.
     */
    private function getSubject(): string
    {
        return match($this->type) {
            'new_order' => 'New Order Received - #' . $this->order->order_id,
            'order_status_changed' => 'Order Status Updated - #' . $this->order->order_id,
            'payment_received' => 'Payment Received - #' . $this->order->order_id,
            'order_shipped' => 'Order Shipped - #' . $this->order->order_id,
            'order_delivered' => 'Order Delivered - #' . $this->order->order_id,
            default => 'Order Notification - #' . $this->order->order_id,
        };
    }

    /**
     * Get notification greeting based on type.
     */
    private function getGreeting(): string
    {
        return match($this->type) {
            'new_order' => 'New Order Alert!',
            'order_status_changed' => 'Order Status Update',
            'payment_received' => 'Payment Confirmation',
            'order_shipped' => 'Order Shipped',
            'order_delivered' => 'Order Delivered',
            default => 'Order Notification',
        };
    }

    /**
     * Get notification content based on type.
     */
    private function getContent(): string
    {
        return match($this->type) {
            'new_order' => 'A new order has been placed and requires your attention.',
            'order_status_changed' => 'The status of an order has been updated.',
            'payment_received' => 'Payment has been received for an order.',
            'order_shipped' => 'An order has been shipped to the customer.',
            'order_delivered' => 'An order has been successfully delivered.',
            default => 'You have received an order notification.',
        };
    }
}
