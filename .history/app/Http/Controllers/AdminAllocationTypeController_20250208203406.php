<?php

namespace App\Http\Controllers;

use App\Models\AllocationType;
use App\Models\AllocationTypeBarangay;
use App\Models\AllocationTypeCommodity;
use App\Models\AllocationTypeCropDamageCause;
use App\Models\AllocationTypeElligibility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAllocationTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $allocationTypes = AllocationType::with([
            'barangays',
            'commodities',
            'cropDamageCauses',
            'elligibilities',
             'identifier',
             'funding'
        ])->get();

        $output = $allocationTypes->map(function ($allocationType) {
            return [
                'id' => $allocationType->id,
                'name' => $allocationType->name,
                'desc' => $allocationType->desc,
                'amount' => $allocationType->amount,
                'identifier_id' => optional($allocationType->identifier)->id,
                'funding_id' => optional($allocationType->funding)->id,
                'barangays' => $allocationType->barangays->map(function ($barangay) {
                    return [
                        'id' => $barangay->id,
                        'name' => $barangay->name
                    ];
                }),
                'commodities' => $allocationType->commodities->map(function ($commodity) {
                    return [
                        'id' => $commodity->id,
                        'name' => $commodity->name
                    ];
                }),
                'crop_damage_causes' => $allocationType->cropDamageCauses->map(function ($cropDamages) {
                    return [
                        'id' => $cropDamages->id,
                        'name' => $cropDamages->name
                    ];
                }),
                'elligibilities' => $allocationType->elligibilities->map(function ($elligibility) {
                    return [
                        'id' => $elligibility->id,
                        'eligibility_type' => $elligibility->elligibility_type
                    ];
                })
            ];
        });

        return Inertia::render("Admin/List/Allocation_Type/Allocation_type_list", [
            'allocationTypes' => $output
        ]);
    }

    public function admin()
    {

        $allocationTypes = AllocationType::with([
            'barangays',
            'commodities',
            'cropDamageCauses',
            'elligibilities'
        ])->get();

        $output = $allocationTypes->map(function ($allocationType) {
            return [
                'id' => $allocationType->id,
                'name' => $allocationType->name,
                'desc' => $allocationType->desc,
                'barangays' => $allocationType->barangays->map(function ($barangay) {
                    return [
                        'id' => $barangay->id,
                        'name' => $barangay->name
                    ];
                }),
                'commodities' => $allocationType->commodities->map(function ($commodity) {
                    return [
                        'id' => $commodity->id,
                        'name' => $commodity->name
                    ];
                }),
                'crop_damage_causes' => $allocationType->cropDamageCauses->map(function ($cropDamages) {
                    return [
                        'id' => $cropDamages->id,
                        'name' => $cropDamages->name
                    ];
                }),
                'elligibilities' => $allocationType->elligibilities->map(function ($elligibility) {
                    return [
                        'id' => $elligibility->id,
                        'eligibility_type' => $elligibility->elligibility_type
                    ];
                })
            ];
        });

        return Inertia::render("Admin/List/Allocation_Type/Allocation_type_list", [
            'allocationTypes' => $output
        ]);
    }


   public function show()
{
    $allocationTypes = AllocationType::with(['identifier', 'funding', 'barangays', 'cropDamageCauses', 'elligibilities', 'commodities'])->get();

    $output = $allocationTypes->map(function ($allocationType) {
        return [
            'allocation_type_id' => $allocationType->id,
            'name' => $allocationType->name,
            'desc' => $allocationType->desc,
            'amount' => $allocationType->amount,

            // Get identifier and funding name/title
            'identifier_id' => optional($allocationType->identifier)->id,
            'identifier_name' => optional($allocationType->identifier)->name,
            'identifier_title' => optional($allocationType->identifier)->title,
            'funding_id' => optional($allocationType->funding)->id,
            'funding_name' => optional($allocationType->funding)->name,
            'funding_title' => optional($allocationType->funding)->title,

            // Barangays
            'allocation_type_barangays' => $allocationType->barangays->map(function ($barangay) {
                return [
                    'barangay_id' => $barangay->id,
                    'barangay_name' => $barangay->name ?? 'Unknown',
                ];
            }),

            // Crop Damage Causes
            'allocation_type_crop_damage_causes' => $allocationType->cropDamageCauses->map(function ($cause) {
                return [
                    'crop_damage_cause_id' => $cause->id,
                    'crop_damage_cause_name' => $cause->name,
                ];
            }),

            // Eligibilities
            'allocation_type_elligibilities' => $allocationType->elligibilities->map(function ($eligibility) {
                return [
                    'elligibility_id' => $eligibility->id,
                    'elligibility_type' => $eligibility->name,
                ];
            }),

            // Commodities
            'allocation_type_commodities' => $allocationType->commodities->map(function ($commodity) {
                return [
                    'commodity_id' => $commodity->id,
                    'commodity_name' => $commodity->name,
                ];
            }),
        ];
    });

    return response()->json($output);
}


    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'barangayIds' => 'array',
            'commodityIds' => 'array',
            'cropDamageCauseIds' => 'array',
            'eligibilityIds' => 'array',
        ]);

        $allocationType = AllocationType::create([
            'name' => $validated['name'],
            'desc' => $validated['desc'],
        ]);

        if (!empty($validated['barangayIds'])) {
            foreach ($validated['barangayIds'] as $barangayId) {
                AllocationTypeBarangay::create([
                    'allocation_type_id' => $allocationType->id,
                    'barangay_id' => $barangayId,
                ]);
            }
        }

        if (!empty($validated['commodityIds'])) {
            foreach ($validated['commodityIds'] as $commodityId) {
                AllocationTypeCommodity::create([
                    'allocation_type_id' => $allocationType->id,
                    'commodity_id' => $commodityId,
                ]);
            }
        }

        if (!empty($validated['cropDamageCauseIds'])) {
            foreach ($validated['cropDamageCauseIds'] as $damageCauseId) {
                AllocationTypeCropDamageCause::create([
                    'allocation_type_id' => $allocationType->id,
                    'crop_damage_cause_id' => $damageCauseId,
                ]);
            }
        }

        if (!empty($validated['eligibilityIds'])) {
            foreach ($validated['eligibilityIds'] as $eligibilityId) {
                AllocationTypeElligibility::create([
                    'allocation_type_id' => $allocationType->id,
                    'elligibility_id' => $eligibilityId,
                ]);
            }
        }


        return response()->json(['message' => 'Allocation type saved successfully']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AllocationType $allocationType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, $id)
    {
        // Validate incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'barangayIds' => 'nullable|array',
            'commodityIds' => 'nullable|array',
            'cropDamageCauseIds' => 'nullable|array',
            'eligibilityIds' => 'nullable|array',
        ]);

        // Find the allocation type by ID or fail if not found
        $allocationType = AllocationType::findOrFail($id);

        // Update the allocation type's basic fields
        $allocationType->update([
            'name' => $validated['name'],
            'desc' => $validated['desc'],
        ]);

        AllocationTypeBarangay::where('allocation_type_id', $id)->delete();
        AllocationTypeCommodity::where('allocation_type_id', $id)->delete();
        AllocationTypeCropDamageCause::where('allocation_type_id', $id)->delete();
        AllocationTypeElligibility::where('allocation_type_id', $id)->delete();

        // Insert the new barangays if provided
        if (!empty($validated['barangayIds'])) {
            foreach ($validated['barangayIds'] as $barangayId) {
                AllocationTypeBarangay::create([
                    'allocation_type_id' => $allocationType->id,
                    'barangay_id' => $barangayId,
                ]);
            }
        }

        // Insert the new commodities if provided
        if (!empty($validated['commodityIds'])) {
            foreach ($validated['commodityIds'] as $commodityId) {
                AllocationTypeCommodity::create([
                    'allocation_type_id' => $allocationType->id,
                    'commodity_id' => $commodityId,
                ]);
            }
        }

        // Insert the new crop damage causes if provided
        if (!empty($validated['cropDamageCauseIds'])) {
            foreach ($validated['cropDamageCauseIds'] as $damageCauseId) {
                AllocationTypeCropDamageCause::create([
                    'allocation_type_id' => $allocationType->id,
                    'crop_damage_cause_id' => $damageCauseId,
                ]);
            }
        }

        // Insert the new eligibilities if provided
        if (!empty($validated['eligibilityIds'])) {
            foreach ($validated['eligibilityIds'] as $eligibilityId) {
                AllocationTypeElligibility::create([
                    'allocation_type_id' => $allocationType->id,
                    'elligibility_id' => $eligibilityId,
                ]);
            }
        }

        // Return success response
        return response()->json(['message' => 'Allocation type updated successfully']);
    }



    /**
     * Remove the specified resource from storage.
     */
   public function destroy($id)
    {
        // Find the allocation type by ID
        $allocationType = AllocationType::findOrFail($id);

        // Delete related records from pivot tables
        AllocationTypeBarangay::where('allocation_type_id', $id)->delete();
        AllocationTypeCommodity::where('allocation_type_id', $id)->delete();
        AllocationTypeCropDamageCause::where('allocation_type_id', $id)->delete();
        AllocationTypeElligibility::where('allocation_type_id', $id)->delete();

        // Finally, delete the allocation type
        $allocationType->delete();

        return response()->json(['message' => 'Allocation type deleted successfully']);
    }

}
