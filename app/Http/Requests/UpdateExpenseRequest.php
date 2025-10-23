<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
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
        return [
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'expense_date' => ['required', 'date'],
            'category' => ['required', 'string', 'max:255'],
            'split_type' => ['required', 'in:equal,exact,percentage,shares'],
            'image' => ['nullable', 'image', 'max:2048'],
            'participants' => ['required', 'array', 'min:1'],
            'participants.*' => ['required'],
        ];
    }
}
