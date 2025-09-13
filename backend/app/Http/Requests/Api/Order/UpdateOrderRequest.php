<?php

namespace App\Http\Requests\Api\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization will be handled in the controller
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'customer_id' => 'sometimes|exists:customers,id',
            'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'payment_method' => 'sometimes|string|max:50',
            'shipping_address' => 'sometimes|array',
            'shipping_address.street' => 'nullable|string|max:255',
            'shipping_address.city' => 'nullable|string|max:100',
            'shipping_address.state' => 'nullable|string|max:100',
            'shipping_address.postal_code' => 'nullable|string|max:20',
            'shipping_address.country' => 'nullable|string|max:100',
            'shipping_cost' => 'sometimes|numeric|min:0',
            'subtotal' => 'sometimes|numeric|min:0',
            'tax' => 'sometimes|numeric|min:0',
            'total' => 'sometimes|numeric|min:0',
            'notes' => 'sometimes|string',
            'items' => 'sometimes|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.price' => 'required_with:items|numeric|min:0',
            'items.*.total' => 'required_with:items|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'customer_id.exists' => 'Selected customer does not exist.',
            'status.in' => 'Invalid order status.',
            'payment_status.in' => 'Invalid payment status.',
            'subtotal.numeric' => 'Subtotal must be a number.',
            'subtotal.min' => 'Subtotal must be at least 0.',
            'total.numeric' => 'Total must be a number.',
            'total.min' => 'Total must be at least 0.',
            'items.*.product_id.required_with' => 'Product is required for order items.',
            'items.*.product_id.exists' => 'Selected product does not exist.',
            'items.*.quantity.required_with' => 'Quantity is required for order items.',
            'items.*.quantity.integer' => 'Quantity must be a whole number.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.price.required_with' => 'Price is required for order items.',
            'items.*.price.numeric' => 'Price must be a number.',
            'items.*.price.min' => 'Price must be at least 0.',
            'items.*.total.required_with' => 'Total is required for order items.',
            'items.*.total.numeric' => 'Total must be a number.',
            'items.*.total.min' => 'Total must be at least 0.',
        ];
    }
}















