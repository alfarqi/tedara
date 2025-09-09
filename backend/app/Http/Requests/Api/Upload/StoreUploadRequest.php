<?php

namespace App\Http\Requests\Api\Upload;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class StoreUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $type = $this->input('type');
        
        // Allow store owners to upload files for their stores
        if ($type === 'store' && $user && $user->isStoreOwner()) {
            return true;
        }
        
        // Allow product uploads for store owners and managers
        if ($type === 'product' && $user && ($user->isStoreOwner() || $user->isStoreManager())) {
            return true;
        }
        
        // Allow general uploads for authenticated users
        if ($type === 'general' && $user) {
            return true;
        }
        
        // Allow user uploads for the user themselves
        if ($type === 'user' && $user) {
            return true;
        }
        
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:jpeg,jpg,png,gif,webp|max:10240', // 10MB max
            'type' => 'required|in:product,store,user,general',
            'folder' => 'nullable|string|max:100',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.file' => 'The uploaded file is invalid.',
            'file.mimes' => 'The file must be a valid image (JPEG, JPG, PNG, GIF, WEBP).',
            'file.max' => 'The file size must not exceed 10MB.',
            'type.required' => 'Upload type is required.',
            'type.in' => 'Invalid upload type. Must be product, store, user, or general.',
            'folder.string' => 'Folder name must be a string.',
            'folder.max' => 'Folder name cannot exceed 100 characters.',
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
                    'message' => 'You are not authorized to upload files.',
                    'status' => 'error',
                ],
            ], 403)
        );
    }
}
