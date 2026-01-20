<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CropDamagesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'farmer_id' => 'required|exists:farmers,id',
            'commodity_id' => 'required|exists:commodities,id',
            'brgy_id' => 'required|exists:barangays,id',
            'total_damaged_area' => 'required|numeric|min:0',
            'partially_damaged_area' => 'nullable|numeric|min:0',
            'area_affected' => 'required|numeric|min:0',
            'cause' => 'required|string|max:255',
            'remarks' => 'nullable|string|max:255',
        ];
    }
}
