<?php

namespace App\Http\Requests\Api\Store;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Store::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'domain' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9\-]+$/',
                'unique:stores,domain',
                'min:3'
            ],
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:100',
            'currency' => 'nullable|string|max:10',
            'language' => 'nullable|string|max:10',
            'timezone' => 'nullable|string|max:50',
            'logo' => 'nullable|string|max:500',
            'status' => 'nullable|in:active,inactive,suspended',
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
            'domain.min' => 'Store domain must be at least 3 characters long.',
            'domain.regex' => 'Store domain can only contain lowercase letters, numbers, and hyphens. No spaces allowed.',
            'domain.unique' => 'This domain is already in use. Please choose a different one.',

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
                    'message' => 'You are not authorized to create stores.',
                    'status' => 'error',
                ],
            ], 403)
        );
    }
}





