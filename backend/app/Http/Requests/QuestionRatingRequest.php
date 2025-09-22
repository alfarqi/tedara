<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuestionRatingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'type' => 'required|in:question,rating',
            'content' => 'required|string|max:1000|min:10',
            'store_id' => 'required|exists:stores,id',
        ];

        // Add rating validation if type is rating
        if ($this->input('type') === 'rating') {
            $rules['rating'] = 'required|integer|min:1|max:5';
        }

        // Add product_id validation if provided
        if ($this->has('product_id')) {
            $rules['product_id'] = 'nullable|exists:products,id';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'The type field is required.',
            'type.in' => 'The type must be either question or rating.',
            'content.required' => 'The content field is required.',
            'content.string' => 'The content must be a string.',
            'content.max' => 'The content may not be greater than 1000 characters.',
            'content.min' => 'The content must be at least 10 characters.',
            'rating.required' => 'The rating field is required for ratings.',
            'rating.integer' => 'The rating must be an integer.',
            'rating.min' => 'The rating must be at least 1.',
            'rating.max' => 'The rating may not be greater than 5.',
            'store_id.required' => 'The store ID is required.',
            'store_id.exists' => 'The selected store does not exist.',
            'product_id.exists' => 'The selected product does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'type' => 'type',
            'content' => 'content',
            'rating' => 'rating',
            'store_id' => 'store',
            'product_id' => 'product',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Additional validation for rating type
            if ($this->input('type') === 'rating' && !$this->has('rating')) {
                $validator->errors()->add('rating', 'Rating is required when type is rating.');
            }

            // Validate that rating is not provided for questions
            if ($this->input('type') === 'question' && $this->has('rating')) {
                $validator->errors()->add('rating', 'Rating should not be provided for questions.');
            }

            // Validate content length based on type
            $content = $this->input('content', '');
            if ($this->input('type') === 'question' && strlen($content) < 20) {
                $validator->errors()->add('content', 'Questions must be at least 20 characters long.');
            }

            if ($this->input('type') === 'rating' && strlen($content) < 5) {
                $validator->errors()->add('content', 'Rating comments must be at least 5 characters long.');
            }
        });
    }
}

















