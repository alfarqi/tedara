<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Jobs\SendEmailNotification;
use App\Models\User;
use App\Models\StoreSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class NotificationController extends BaseController
{
    /**
     * Send test email notification.
     */
    public function testEmail(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $email = $request->input('email');
            $subject = $request->input('subject');
            $message = $request->input('message');

            // Dispatch email job
            SendEmailNotification::dispatch($email, $subject, $message);

            return $this->successResponse(null, 'Test email sent successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to send test email: ' . $e->getMessage());
        }
    }

    /**
     * Update notification settings.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email_notifications' => 'boolean',
                'sms_notifications' => 'boolean',
                'notification_types' => 'array',
                'notification_types.*' => 'string|in:new_orders,low_stock,customer_reviews,system_updates',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $user = $request->user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return $this->errorResponse('No store found for this user', 400);
            }

            // Update notification settings
            if ($request->has('email_notifications')) {
                StoreSetting::updateOrCreate(
                    ['store_id' => $store->id, 'key' => 'email_notifications'],
                    ['value' => $request->boolean('email_notifications')]
                );
            }

            if ($request->has('sms_notifications')) {
                StoreSetting::updateOrCreate(
                    ['store_id' => $store->id, 'key' => 'sms_notifications'],
                    ['value' => $request->boolean('sms_notifications')]
                );
            }

            if ($request->has('notification_types')) {
                StoreSetting::updateOrCreate(
                    ['store_id' => $store->id, 'key' => 'notification_types'],
                    ['value' => json_encode($request->input('notification_types'))]
                );
            }

            return $this->successResponse(null, 'Notification settings updated successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update notification settings: ' . $e->getMessage());
        }
    }

    /**
     * Get notification settings.
     */
    public function getSettings(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return $this->errorResponse('No store found for this user', 400);
            }

            $settings = StoreSetting::where('store_id', $store->id)
                ->whereIn('key', ['email_notifications', 'sms_notifications', 'notification_types'])
                ->pluck('value', 'key')
                ->toArray();

            $notificationSettings = [
                'email_notifications' => (bool) ($settings['email_notifications'] ?? true),
                'sms_notifications' => (bool) ($settings['sms_notifications'] ?? false),
                'notification_types' => json_decode($settings['notification_types'] ?? '["new_orders","low_stock","system_updates"]', true),
            ];

            return $this->successResponse($notificationSettings, 'Notification settings retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to get notification settings: ' . $e->getMessage());
        }
    }

    /**
     * Send notification to specific users.
     */
    public function sendToUsers(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_ids' => 'required|array',
                'user_ids.*' => 'integer|exists:users,id',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
                'type' => 'required|in:email,sms,both',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $userIds = $request->input('user_ids');
            $subject = $request->input('subject');
            $message = $request->input('message');
            $type = $request->input('type');

            $users = User::whereIn('id', $userIds)->get();
            $sentCount = 0;

            foreach ($users as $user) {
                if ($type === 'email' || $type === 'both') {
                    SendEmailNotification::dispatch($user->email, $subject, $message);
                    $sentCount++;
                }

                // TODO: Implement SMS notification when SMS service is integrated
                if ($type === 'sms' || $type === 'both') {
                    // SendSmsNotification::dispatch($user->phone, $message);
                    $sentCount++;
                }
            }

            return $this->successResponse([
                'sent_count' => $sentCount,
                'total_users' => count($users),
            ], 'Notifications sent successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to send notifications: ' . $e->getMessage());
        }
    }

    /**
     * Get notification history.
     */
    public function history(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $store = $user->ownedStores()->first();

            if (!$store) {
                return $this->errorResponse('No store found for this user', 400);
            }

            // TODO: Implement notification history table and model
            // For now, return empty array
            $history = [];

            return $this->successResponse($history, 'Notification history retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to get notification history: ' . $e->getMessage());
        }
    }
}
