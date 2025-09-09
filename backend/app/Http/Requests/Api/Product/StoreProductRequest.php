<?php

namespace App\Http\Requests\Api\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Product::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'price' => 'required|numeric|min:0|max:999999.99',
            'original_price' => 'nullable|numeric|min:0|max:999999.99|gte:price',
            'stock' => 'required|integer|min:0|max:999999',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:active,inactive,draft',
            'images' => 'nullable|array',
            'images.*' => 'string|max:500',
            'weight' => 'nullable|numeric|min:0|max:999.99',
            'dimensions' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.string' => 'Product name must be a string.',
            'name.max' => 'Product name cannot exceed 255 characters.',
            
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            
            'sku.required' => 'SKU is required if provided.',
            'sku.string' => 'SKU must be a string.',
            'sku.max' => 'SKU cannot exceed 100 characters.',
            'sku.unique' => 'This SKU is already in use.',
            
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a number.',
            'price.min' => 'Price must be at least 0.',
            'price.max' => 'Price cannot exceed 999,999.99.',
            
            'original_price.numeric' => 'Original price must be a number.',
            'original_price.min' => 'Original price must be at least 0.',
            'original_price.max' => 'Original price cannot exceed 999,999.99.',
            'original_price.gte' => 'Original price must be greater than or equal to the current price.',
            
            'stock.required' => 'Stock quantity is required.',
            'stock.integer' => 'Stock must be a whole number.',
            'stock.min' => 'Stock cannot be negative.',
            'stock.max' => 'Stock cannot exceed 999,999.',
            
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Selected category does not exist.',
            
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be active, inactive, or draft.',
            
            'images.array' => 'Images must be an array.',
            'images.*.string' => 'Each image must be a string.',
            'images.*.max' => 'Image URL cannot exceed 500 characters.',
            
            'weight.numeric' => 'Weight must be a number.',
            'weight.min' => 'Weight cannot be negative.',
            'weight.max' => 'Weight cannot exceed 999.99.',
            
            'dimensions.string' => 'Dimensions must be a string.',
            'dimensions.max' => 'Dimensions cannot exceed 100 characters.',
            
            'brand.string' => 'Brand must be a string.',
            'brand.max' => 'Brand cannot exceed 100 characters.',
            
            'tags.array' => 'Tags must be an array.',
            'tags.*.string' => 'Each tag must be a string.',
            'tags.*.max' => 'Each tag cannot exceed 50 characters.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'data' => null,
                'meta' => [
                    'message' => 'Validation failed',
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ],
            ], 422)
        );
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(
            response()->json([
                'data' => null,
                'meta' => [
                    'message' => 'You are not authorized to create products.',
                    'status' => 'error',
                ],
            ], 403)
        );
    }
}
