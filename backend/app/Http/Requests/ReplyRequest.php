<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ReplyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'min:10', 'max:1000'],
            'question_rating_id' => ['required', 'exists:question_ratings,id'],
            'status' => ['sometimes', 'in:published,unpublished'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'content.required' => 'Reply content is required.',
            'content.min' => 'Reply content must be at least 10 characters.',
            'content.max' => 'Reply content cannot exceed 1000 characters.',
            'question_rating_id.required' => 'Question/Rating ID is required.',
            'question_rating_id.exists' => 'The selected question/rating does not exist.',
            'status.in' => 'Status must be either published or unpublished.',
        ];
    }
}
