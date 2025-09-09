<?php

namespace App\Http\Requests\Api\Store;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        $store = $this->route('store');
        return $this->user()->can('update', $store);
    }

    public function rules(): array
    {
        $storeId = $this->route('store')->id;

        return [
            'name' => 'sometimes|required|string|max:255',
            'domain' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('stores', 'domain')->ignore($storeId),
            ],
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:100',
            'currency' => 'nullable|string|max:10',
            'language' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
            'logo' => 'nullable|string|max:500',
            'status' => 'sometimes|required|in:active,inactive,suspended',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Store name is required.',
            'name.string' => 'Store name must be a string.',
            'name.max' => 'Store name cannot exceed 255 characters.',

            'domain.required' => 'Store domain is required.',
            'domain.string' => 'Store domain must be a string.',
            'domain.max' => 'Store domain cannot exceed 255 characters.',
            'domain.unique' => 'This domain is already in use.',

            'description.string' => 'Description must be a string.',
            'description.max' => 'Description cannot exceed 1000 characters.',

            'category.string' => 'Category must be a string.',
            'category.max' => 'Category cannot exceed 100 characters.',

            'currency.string' => 'Currency must be a string.',
            'currency.max' => 'Currency cannot exceed 10 characters.',

            'language.string' => 'Language must be a string.',
            'language.max' => 'Language cannot exceed 10 characters.',

            'timezone.string' => 'Timezone must be a string.',
            'timezone.max' => 'Timezone cannot exceed 50 characters.',

            'logo.string' => 'Logo must be a string.',
            'logo.max' => 'Logo URL cannot exceed 500 characters.',

            'status.required' => 'Status is required.',
            'status.in' => 'Status must be active, inactive, or suspended.',
        ];
    }

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

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(
            response()->json([
                'data' => null,
                'meta' => [
                    'message' => 'You are not authorized to update this store.',
                    'status' => 'error',
                ],
            ], 403)
        );
    }
}





