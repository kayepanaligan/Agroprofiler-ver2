<?php

namespace App\Http\Controllers;

use App\Models\Allocation;
use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\CommodityCategory;
use App\Models\Farmer;
use App\Models\Farm;
use App\Models\Commodity;
use App\Models\CropDamage;
use App\Models\CropDamageCause;
use App\Models\Elligibility;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{


    public function showResponseDashboard()
    {

        $barangays = Barangay::all();
        $allocations = Allocation::all();
        $allocationType = AllocationType::all();
        $commodityCategories = CommodityCategory::with('commodities')->get();
        $registeredFarmers = Farmer::where('status', 'registered')->count();
        $unregisteredFarmers = Farmer::where('status', 'unregistered')->count();
        $totalFarmers = Farmer::count();
        $heatmapData = [];

        foreach ($barangays as $barangay) {
            $barangayFarms = Farm::with('farmer')->where('brgy_id', $barangay->id)->get();
            $registeredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer->status === 'registered')->count();
            $unregisteredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer->status === 'unregistered')->count();

            $heatmapData[$barangay->name] = [
                'allocations' => [],
                'commodities_categories' => [],
                'farmers' => [
                    'Registered' => $registeredFarmersInBarangay,
                    'Unregistered' => $unregisteredFarmersInBarangay,
                ],
                'commodities' => [], // Make sure this is here to hold commodity data
            ];

            // Get allocations for each barangay
            foreach ($allocationType as $type) {
                $count = $allocations->where('allocation_type_id', $type->id)->where('brgy_id', $barangay->id)->count();
                $heatmapData[$barangay->name]['allocations'][$type->name] = $count;
            }

           foreach ($commodityCategories as $category) {
                $categoryCommodities = [];

                foreach ($category->commodities as $commodity) {
                    $count = $barangayFarms->filter(function ($farm) use ($commodity) {
                        return $farm->commodity_id === $commodity->id;
                    })->count();

                    $categoryCommodities[$commodity->name] = $count;
                }

                $heatmapData[$barangay->name]['commodities_categories'][$category->name] = $categoryCommodities;
            }

    }

    return response()->json( [

        'totalAllocations' => $allocations->count(),
        'allocationType' => $allocationType,
        'registeredFarmers' => $registeredFarmers,
        'unregisteredFarmers' => $unregisteredFarmers,
        'totalFarmers' => $totalFarmers,
        'heatmapData' => $heatmapData,
        'commodityCategories' => $commodityCategories,
    ]);
}

    public function index(Request $request) {
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        // Helper closure for date range filtering
        $applyDateFilter = function($query, $dateColumn = 'created_at') use ($dateFrom, $dateTo) {
            if ($dateFrom && $dateTo) {
                $query->whereBetween($dateColumn, [$dateFrom, $dateTo]);
            } elseif ($dateFrom) {
                $query->whereDate($dateColumn, '>=', $dateFrom);
            } elseif ($dateTo) {
                $query->whereDate($dateColumn, '<=', $dateTo);
            }
            return $query;
        };

        $barangays = Barangay::all();
        $allocationType = AllocationType::with('identifier')->get();
        $commodityCategories = CommodityCategory::with('commodities')->get();

        $totalAllocations = Allocation::whereNotNull('created_at')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->count();

        $registeredFarmers = Farmer::where('status', 'registered')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->count();

        $unregisteredFarmers = Farmer::where('status', 'unregistered')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->count();

        $totalFarmers = $registeredFarmers + $unregisteredFarmers;

        // Calculate age groups distribution
        $ageGroups = [
            '18-25' => 0,
            '26-35' => 0,
            '36-45' => 0,
            '46-55' => 0,
            '56-65' => 0,
            '66+' => 0,
        ];

        $farmersQuery = Farmer::when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query));
        $allFarmers = $farmersQuery->get();

        foreach ($allFarmers as $farmer) {
            if ($farmer->dob) {
                // Calculate age from date of birth
                $birthDate = new \DateTime($farmer->dob);
                $today = new \DateTime();
                $age = $today->diff($birthDate)->y;

                if ($age >= 18 && $age <= 25) {
                    $ageGroups['18-25']++;
                } elseif ($age >= 26 && $age <= 35) {
                    $ageGroups['26-35']++;
                } elseif ($age >= 36 && $age <= 45) {
                    $ageGroups['36-45']++;
                } elseif ($age >= 46 && $age <= 55) {
                    $ageGroups['46-55']++;
                } elseif ($age >= 56 && $age <= 65) {
                    $ageGroups['56-65']++;
                } elseif ($age >= 66) {
                    $ageGroups['66+']++;
                }
            }
        }

        $ageGroupData = array_map(function($range, $count) {
            return [
                'ageRange' => $range,
                'count' => $count,
            ];
        }, array_keys($ageGroups), array_values($ageGroups));

        // Calculate farmers per commodity
        $farmersPerCommodity = Commodity::withCount(['farms' => function($query) use ($applyDateFilter) {
            $applyDateFilter($query);
        }])
        ->get()
        ->filter(function($commodity) {
            return $commodity->farms_count > 0;
        })
        ->sortByDesc('farms_count')
        ->values()
        ->map(function($commodity) use ($applyDateFilter) {
            // Get unique farmers for this commodity
            $query = Farm::where('commodity_id', $commodity->id);
            $applyDateFilter($query);
            $farmerIds = $query->distinct('farmer_id')->pluck('farmer_id');
            $farmerCount = $farmerIds->count();
            
            return [
                'name' => $commodity->name,
                'value' => $farmerCount,
            ];
        })
        ->filter(fn($item) => $item['value'] > 0)
        ->values();

        $heatmapData = [];

        foreach ($barangays as $barangay) {
            $barangayFarmsQuery = Farm::with('farmer')->where('brgy_id', $barangay->id);
            if ($dateFrom || $dateTo) {
                $applyDateFilter($barangayFarmsQuery);
            }
            $barangayFarms = $barangayFarmsQuery->get();

            $registeredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer?->status === 'registered')->count();
            $unregisteredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer?->status === 'unregistered')->count();
            $totalFarmersInBarangay = $registeredFarmersInBarangay + $unregisteredFarmersInBarangay;

            // Crop damage distribution per barangay (damaged farms regardless of severity)
            $totalFarmsInBarangay = $barangayFarms->count();

            $barangayCropDamagesQuery = CropDamage::where('brgy_id', $barangay->id);
            if ($dateFrom || $dateTo) {
                $applyDateFilter($barangayCropDamagesQuery);
            }

            $damagedFarmsInBarangay = (clone $barangayCropDamagesQuery)
                ->distinct('farm_id')
                ->count('farm_id');

            $damagePercentage = $totalFarmsInBarangay > 0
                ? round(($damagedFarmsInBarangay / $totalFarmsInBarangay) * 100, 1)
                : 0;

            $severityHigh = (clone $barangayCropDamagesQuery)->where('severity', 'high')->distinct('farm_id')->count('farm_id');
            $severityMedium = (clone $barangayCropDamagesQuery)->where('severity', 'medium')->distinct('farm_id')->count('farm_id');
            $severityLow = (clone $barangayCropDamagesQuery)->where('severity', 'low')->distinct('farm_id')->count('farm_id');

            $topDamagedCommodityRow = (clone $barangayCropDamagesQuery)
                ->select('commodity_id', DB::raw('COUNT(DISTINCT farm_id) as damaged_farms'))
                ->groupBy('commodity_id')
                ->orderByDesc('damaged_farms')
                ->first();
            $topDamagedCommodity = $topDamagedCommodityRow
                ? (Commodity::find($topDamagedCommodityRow->commodity_id)?->name ?? 'N/A')
                : 'N/A';

            $topDamageCauseRow = (clone $barangayCropDamagesQuery)
                ->select('crop_damage_cause_id', DB::raw('COUNT(DISTINCT farm_id) as damaged_farms'))
                ->groupBy('crop_damage_cause_id')
                ->orderByDesc('damaged_farms')
                ->first();
            $topDamageCause = $topDamageCauseRow
                ? (CropDamageCause::find($topDamageCauseRow->crop_damage_cause_id)?->name ?? 'N/A')
                : 'N/A';

            $heatmapData[$barangay->name] = [
                'allocations' => [],
                'commodities_categories' => [],
                'farmers' => [
                    'Registered' => $registeredFarmersInBarangay,
                    'Unregistered' => $unregisteredFarmersInBarangay,
                    'Total' => $totalFarmersInBarangay,
                ],
                'commodities' => [],
                'crop_damage' => [
                    'totalFarms' => $totalFarmsInBarangay,
                    'damagedFarms' => $damagedFarmsInBarangay,
                    'percentage' => $damagePercentage,
                    'severity' => [
                        'high' => $severityHigh,
                        'medium' => $severityMedium,
                        'low' => $severityLow,
                    ],
                    'topCommodity' => $topDamagedCommodity,
                    'topCause' => $topDamageCause,
                ],
            ];

            foreach ($allocationType as $type) {
                $allocationQuery = Allocation::where('allocation_type_id', $type->id)
                    ->where('brgy_id', $barangay->id);
                if ($dateFrom || $dateTo) {
                    $applyDateFilter($allocationQuery);
                }

                $count = $allocationQuery->count();
                $totalAmount = $allocationQuery->sum(DB::raw("CAST(amount AS DECIMAL(10,2))"));

                $heatmapData[$barangay->name]['allocations'][$type->name] = [
                    'count' => $count,
                    'amount' => $totalAmount,
                ];
            }

            foreach ($commodityCategories as $category) {
                $categoryCommodities = [];

                foreach ($category->commodities as $commodity) {
                    $count = $barangayFarms->filter(fn($farm) => $farm->commodity_id === $commodity->id)->count();
                    $categoryCommodities[$commodity->name] = $count;
                }

                $heatmapData[$barangay->name]['commodities_categories'][$category->name] = $categoryCommodities;
            }
        }

            $allocationTypeCounts = Allocation::select(
                'allocation_type_id',
                DB::raw('count(*) as count'),
                DB::raw('SUM(CAST(amount AS DECIMAL(10,2))) as total_amount')
            );
            if ($dateFrom || $dateTo) {
                $applyDateFilter($allocationTypeCounts);
            }
            $allocationTypeCounts = $allocationTypeCounts
            ->groupBy('allocation_type_id')
            ->get();

            $data = $allocationTypeCounts->map(function ($allocation) {
            $allocationType = AllocationType::find($allocation->allocation_type_id);
            return [
                'id' => $allocationType->id,
                'name' => $allocationType ? $allocationType->name : 'Unknown',
                'value' => $allocation->count,
                'totalAmount' => $allocation->total_amount,
            ];
        });

        // KPI Calculations
        // 1. Total Farmers KPI
        $pwdFarmers = Farmer::where('pwd', 'yes')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->count();
        $fourPsFarmers = Farmer::where('4ps', 'yes')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->count();
        $ipEligibility = Elligibility::where('name', 'like', '%ip%')
            ->orWhere('name', 'like', '%indigenous%')
            ->first();
        $ipFarmers = 0;
        if ($ipEligibility) {
            $ipFarmers = Farmer::whereHas('elligibilities', function($query) use ($ipEligibility) {
                $query->where('elligibility_id', $ipEligibility->id);
            })
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->count();
        }

        $farmerPercentages = [
            'registered' => $totalFarmers > 0 ? round(($registeredFarmers / $totalFarmers) * 100, 1) : 0,
            'unregistered' => $totalFarmers > 0 ? round(($unregisteredFarmers / $totalFarmers) * 100, 1) : 0,
            'pwd' => $totalFarmers > 0 ? round(($pwdFarmers / $totalFarmers) * 100, 1) : 0,
            'ip' => $totalFarmers > 0 ? round(($ipFarmers / $totalFarmers) * 100, 1) : 0,
            '4ps' => $totalFarmers > 0 ? round(($fourPsFarmers / $totalFarmers) * 100, 1) : 0,
        ];

        // 2. Total Farms KPI
        $totalFarms = Farm::when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))->count();
        $topCommodity = Commodity::withCount(['farms' => function($query) use ($applyDateFilter) {
            $applyDateFilter($query);
        }])
        ->orderByDesc('farms_count')
        ->first();
        $avgFarmSize = Farm::when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->selectRaw('AVG(CAST(ha AS DECIMAL(10,2))) as avg_size')
            ->value('avg_size') ?? 0;
        
        // Calculate average farms per barangay
        $farmsQuery = Farm::when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query));
        $distinctBarangaysWithFarms = $farmsQuery->distinct('brgy_id')->count('brgy_id');
        $avgFarmsPerBarangay = $distinctBarangaysWithFarms > 0 ? round($totalFarms / $distinctBarangaysWithFarms, 2) : 0;
        
        // Calculate average farms per farmer
        $distinctFarmersWithFarms = $farmsQuery->distinct('farmer_id')->count('farmer_id');
        $avgFarmsPerFarmer = $distinctFarmersWithFarms > 0 ? round($totalFarms / $distinctFarmersWithFarms, 2) : 0;

        // 3. Farmers Affected by Crop Damage KPI
        $farmersWithDamage = CropDamage::when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->distinct('farmer_id')
            ->count('farmer_id');
        $cropDamagePercentage = $totalFarmers > 0 ? round(($farmersWithDamage / $totalFarmers) * 100, 1) : 0;

        // Calculate intensity percentages
        $highIntensityFarmers = CropDamage::where('severity', 'high')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->distinct('farmer_id')
            ->count('farmer_id');
        $mediumIntensityFarmers = CropDamage::where('severity', 'medium')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->distinct('farmer_id')
            ->count('farmer_id');
        $lowIntensityFarmers = CropDamage::where('severity', 'low')
            ->when($dateFrom || $dateTo, fn($query) => $applyDateFilter($query))
            ->distinct('farmer_id')
            ->count('farmer_id');

        $intensityPercentages = [
            'high' => $farmersWithDamage > 0 ? round(($highIntensityFarmers / $farmersWithDamage) * 100, 1) : 0,
            'medium' => $farmersWithDamage > 0 ? round(($mediumIntensityFarmers / $farmersWithDamage) * 100, 1) : 0,
            'low' => $farmersWithDamage > 0 ? round(($lowIntensityFarmers / $farmersWithDamage) * 100, 1) : 0,
        ];
        
        $mostAffectedCommodity = Commodity::withCount(['cropDamages' => function($query) use ($applyDateFilter) {
            $applyDateFilter($query);
        }])
        ->orderByDesc('crop_damages_count')
        ->first();

        $mostImpactedGroupQuery = DB::table('crop_damages')
            ->join('farmers', 'crop_damages.farmer_id', '=', 'farmers.id');
        if ($dateFrom && $dateTo) {
            $mostImpactedGroupQuery->whereBetween('crop_damages.created_at', [$dateFrom, $dateTo]);
        } elseif ($dateFrom) {
            $mostImpactedGroupQuery->whereDate('crop_damages.created_at', '>=', $dateFrom);
        } elseif ($dateTo) {
            $mostImpactedGroupQuery->whereDate('crop_damages.created_at', '<=', $dateTo);
        }
        $mostImpactedGroup = $mostImpactedGroupQuery
            ->select('farmers.status', DB::raw('COUNT(DISTINCT crop_damages.farmer_id) as affected_count'))
            ->groupBy('farmers.status')
            ->orderByDesc('affected_count')
            ->first();

        $topCropDamageCause = CropDamageCause::withCount(['cropDamages' => function($query) use ($applyDateFilter) {
            $applyDateFilter($query);
        }])
        ->orderByDesc('crop_damages_count')
        ->first();

        $mostAffectedBarangayQuery = CropDamage::query();
        $applyDateFilter($mostAffectedBarangayQuery);
        $mostAffectedBarangay = $mostAffectedBarangayQuery
            ->select('brgy_id', DB::raw('COUNT(*) as damage_count'))
            ->groupBy('brgy_id')
            ->orderByDesc('damage_count')
            ->with('barangay')
            ->first();

        // 4. Allocation Distribution Coverage KPI
        $totalAllocationPlanned = AllocationType::sum('amount');
        $totalAllocationDeliveredQuery = Allocation::where('received', 'yes');
        if ($dateFrom || $dateTo) {
            $applyDateFilter($totalAllocationDeliveredQuery, 'date_received');
        }
        $totalAllocationDelivered = $totalAllocationDeliveredQuery->sum(DB::raw("CAST(amount AS DECIMAL(10,2))"));
        $allocationCoverage = $totalAllocationPlanned > 0 
            ? round(($totalAllocationDelivered / $totalAllocationPlanned) * 100, 1) 
            : 0;

        $topAllocatedCommodityQuery = Allocation::where('received', 'yes');
        if ($dateFrom || $dateTo) {
            $applyDateFilter($topAllocatedCommodityQuery, 'date_received');
        }
        $topAllocatedCommodity = $topAllocatedCommodityQuery
            ->select('commodity_id', DB::raw('COUNT(*) as allocation_count'))
            ->groupBy('commodity_id')
            ->orderByDesc('allocation_count')
            ->with('commodity')
            ->first();

        $totalFarmsWithAllocationsQuery = Allocation::where('received', 'yes');
        if ($dateFrom || $dateTo) {
            $applyDateFilter($totalFarmsWithAllocationsQuery, 'date_received');
        }
        $totalFarmsWithAllocations = $totalFarmsWithAllocationsQuery->distinct('farmer_id')->count('farmer_id');
        $avgAllocationPerFarm = $totalFarmsWithAllocations > 0 
            ? round($totalAllocationDelivered / $totalFarmsWithAllocations, 2) 
            : 0;

        $topAllocatedBarangaysQuery = Allocation::where('received', 'yes');
        if ($dateFrom || $dateTo) {
            $applyDateFilter($topAllocatedBarangaysQuery, 'date_received');
        }
        $topAllocatedBarangays = $topAllocatedBarangaysQuery
            ->select('brgy_id', DB::raw('SUM(CAST(amount AS DECIMAL(10,2))) as total_amount'))
            ->groupBy('brgy_id')
            ->orderByDesc('total_amount')
            ->with('barangay')
            ->limit(3)
            ->get();

        $topAllocationSourceQuery = Allocation::where('received', 'yes');
        if ($dateFrom || $dateTo) {
            $applyDateFilter($topAllocationSourceQuery, 'date_received');
        }
        $topAllocationSource = $topAllocationSourceQuery
            ->select('funding_id', DB::raw('SUM(CAST(amount AS DECIMAL(10,2))) as total_amount'))
            ->groupBy('funding_id')
            ->orderByDesc('total_amount')
            ->with('funding')
            ->first();

        return Inertia::render('Super Admin/Dashboard', [
            'totalAllocations' => $totalAllocations,
            'allocationType' => $allocationType,
            'registeredFarmers' => $registeredFarmers,
            'unregisteredFarmers' => $unregisteredFarmers,
            'totalFarmers' => $totalFarmers,
            'farmersPerCommodity' => $farmersPerCommodity,
            'heatmapData' => $heatmapData,
            'data' => $data,
            'commodityCategories' => $commodityCategories,
            'cropDamageCauses' => CropDamageCause::all(),
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'farmersPerCommodity' => $farmersPerCommodity,
            'ageGroupData' => $ageGroupData,
            // KPI Data
            'kpiData' => [
                'farmers' => [
                    'total' => $totalFarmers,
                    'percentages' => $farmerPercentages,
                    'counts' => [
                        'registered' => $registeredFarmers,
                        'unregistered' => $unregisteredFarmers,
                        'pwd' => $pwdFarmers,
                        'ip' => $ipFarmers,
                        '4ps' => $fourPsFarmers,
                    ],
                ],
                'farms' => [
                    'total' => $totalFarms,
                    'topCommodity' => $topCommodity ? $topCommodity->name : 'N/A',
                    'avgFarmSize' => round($avgFarmSize, 2),
                    'avgFarmsPerBarangay' => $avgFarmsPerBarangay,
                    'avgFarmsPerFarmer' => $avgFarmsPerFarmer,
                ],
                'cropDamage' => [
                    'percentage' => $cropDamagePercentage,
                    'intensityPercentages' => $intensityPercentages,
                    'mostAffectedCommodity' => $mostAffectedCommodity ? $mostAffectedCommodity->name : 'N/A',
                    'mostImpactedGroup' => $mostImpactedGroup ? ucfirst($mostImpactedGroup->status) : 'N/A',
                    'topCropDamageCause' => $topCropDamageCause ? $topCropDamageCause->name : 'N/A',
                    'mostAffectedBarangay' => $mostAffectedBarangay && $mostAffectedBarangay->barangay ? $mostAffectedBarangay->barangay->name : 'N/A',
                ],
                'allocationCoverage' => [
                    'percentage' => $allocationCoverage,
                    'totalPlanned' => $totalAllocationPlanned,
                    'totalDelivered' => $totalAllocationDelivered,
                    'topAllocationSource' => $topAllocationSource && $topAllocationSource->funding ? $topAllocationSource->funding->name : 'N/A',
                    'topAllocatedCommodity' => $topAllocatedCommodity && $topAllocatedCommodity->commodity ? $topAllocatedCommodity->commodity->name : 'N/A',
                    'avgAllocationPerFarm' => $avgAllocationPerFarm,
                    'topAllocatedBarangays' => $topAllocatedBarangays->map(function($item) {
                        return $item->barangay ? $item->barangay->name : 'N/A';
                    })->filter(fn($name) => $name !== 'N/A')->toArray(),
                ],
            ],
        ]);
    }

     public function showAdmin(Request $request) {
        $selectedYear = $request->query('year', 'all'); // Default to "all"

        $barangays = Barangay::all();
        $allocationType = AllocationType::with('identifier')->get();
        $commodityCategories = CommodityCategory::with('commodities')->get();

        $years = Allocation::selectRaw("strftime('%Y', created_at) as year")
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->toArray();

        array_unshift($years, 'All');

        $totalAllocations = Allocation::whereNotNull('created_at')
            ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
            ->count();

        $registeredFarmers = Farmer::where('status', 'registered')
            ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
            ->count();

        $unregisteredFarmers = Farmer::where('status', 'unregistered')
            ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
            ->count();

        $totalFarmers = $registeredFarmers + $unregisteredFarmers;

        $heatmapData = [];

        foreach ($barangays as $barangay) {
            $barangayFarmsQuery = Farm::with('farmer')->where('brgy_id', $barangay->id);
            if ($selectedYear !== 'all') {
                $barangayFarmsQuery->whereYear('created_at', $selectedYear);
            }
            $barangayFarms = $barangayFarmsQuery->get();

            $registeredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer?->status === 'registered')->count();
            $unregisteredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer?->status === 'unregistered')->count();
            $totalFarmersInBarangay = $registeredFarmersInBarangay + $unregisteredFarmersInBarangay;

            $heatmapData[$barangay->name] = [
                'allocations' => [],
                'commodities_categories' => [],
                'farmers' => [
                    'Registered' => $registeredFarmersInBarangay,
                    'Unregistered' => $unregisteredFarmersInBarangay,
                    'Total' => $totalFarmersInBarangay,
                ],
                'commodities' => [],
            ];

            foreach ($allocationType as $type) {
                $allocationQuery = Allocation::where('allocation_type_id', $type->id)
                    ->where('brgy_id', $barangay->id);
                if ($dateFrom || $dateTo) {
                    $applyDateFilter($allocationQuery);
                }

                $count = $allocationQuery->count();
                $totalAmount = $allocationQuery->sum(DB::raw("CAST(amount AS DECIMAL(10,2))"));

                $heatmapData[$barangay->name]['allocations'][$type->name] = [
                    'count' => $count,
                    'amount' => $totalAmount,
                ];
            }

            foreach ($commodityCategories as $category) {
                $categoryCommodities = [];

                foreach ($category->commodities as $commodity) {
                    $count = $barangayFarms->filter(fn($farm) => $farm->commodity_id === $commodity->id)->count();
                    $categoryCommodities[$commodity->name] = $count;
                }

                $heatmapData[$barangay->name]['commodities_categories'][$category->name] = $categoryCommodities;
            }
        }

            $allocationTypeCounts = Allocation::select(
                'allocation_type_id',
                DB::raw('count(*) as count'),
                DB::raw('SUM(CAST(amount AS DECIMAL(10,2))) as total_amount')
            )
            ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
            ->groupBy('allocation_type_id')
            ->get();

            $data = $allocationTypeCounts->map(function ($allocation) {
            $allocationType = AllocationType::find($allocation->allocation_type_id);
            return [
                'id' => $allocationType->id,
                'name' => $allocationType ? $allocationType->name : 'Unknown',
                'value' => $allocation->count,
                'totalAmount' => $allocation->total_amount,
            ];
        });

        return Inertia::render('Admin/AdminDashboard', [
            'totalAllocations' => $totalAllocations,
            'allocationType' => $allocationType,
            'registeredFarmers' => $registeredFarmers,
            'unregisteredFarmers' => $unregisteredFarmers,
            'totalFarmers' => $totalFarmers,
            'heatmapData' => $heatmapData,
            'data' => $data,
            'commodityCategories' => $commodityCategories,
            'years' => $years,
            'selectedYear' => $selectedYear,
        ]);
    }

public function indexResponse(Request $request) {
    $selectedYear = $request->query('year', 'all'); // Default to "all"

    $barangays = Barangay::all();
    $allocationType = AllocationType::with('identifier')->get();
    $commodityCategories = CommodityCategory::with('commodities')->get();

    $years = Allocation::selectRaw('YEAR(created_at) as year')
        ->distinct()
        ->orderByDesc('year')
        ->pluck('year')
        ->toArray();

    array_unshift($years, 'All');

    $totalAllocations = Allocation::whereNotNull('created_at')
        ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
        ->count();

    $registeredFarmers = Farmer::where('status', 'registered')
        ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
        ->count();

    $unregisteredFarmers = Farmer::where('status', 'unregistered')
        ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
        ->count();

    $totalFarmers = $registeredFarmers + $unregisteredFarmers;

    $heatmapData = [];

    foreach ($barangays as $barangay) {
        $barangayFarmsQuery = Farm::with('farmer')->where('brgy_id', $barangay->id);
        if ($selectedYear !== 'all') {
            $barangayFarmsQuery->whereYear('created_at', $selectedYear);
        }
        $barangayFarms = $barangayFarmsQuery->get();

        $registeredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer?->status === 'registered')->count();
        $unregisteredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer?->status === 'unregistered')->count();
        $totalFarmersInBarangay = $registeredFarmersInBarangay + $unregisteredFarmersInBarangay;

        $heatmapData[$barangay->name] = [
            'allocations' => [],
            'commodities_categories' => [],
            'farmers' => [
                'Registered' => $registeredFarmersInBarangay,
                'Unregistered' => $unregisteredFarmersInBarangay,
                'Total' => $totalFarmersInBarangay,
            ],
            'commodities' => [],
        ];

        foreach ($allocationType as $type) {
            $allocationQuery = Allocation::where('allocation_type_id', $type->id)
                ->where('brgy_id', $barangay->id)
                ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear));

            $count = $allocationQuery->count();
            $totalAmount = $allocationQuery->sum(DB::raw("CAST(amount AS DECIMAL(10,2))"));


            $heatmapData[$barangay->name]['allocations'][$type->name] = [
                'count' => $count,
                'amount' => $totalAmount,
            ];
        }

        foreach ($commodityCategories as $category) {
            $categoryCommodities = [];

            foreach ($category->commodities as $commodity) {
                $count = $barangayFarms->filter(fn($farm) => $farm->commodity_id === $commodity->id)->count();
                $categoryCommodities[$commodity->name] = $count;
            }

            $heatmapData[$barangay->name]['commodities_categories'][$category->name] = $categoryCommodities;
        }
    }

    $allocationTypeCounts = Allocation::select(
        'allocation_type_id',
        DB::raw('count(*) as count'),
        DB::raw('SUM(CAST(amount AS DECIMAL(10,2))) as total_amount')
    )
    ->when($selectedYear !== 'all', fn($query) => $query->whereYear('created_at', $selectedYear))
    ->groupBy('allocation_type_id')
    ->get();

    $data = $allocationTypeCounts->map(function ($allocation) {
        $allocationType = AllocationType::find($allocation->allocation_type_id);
        return [
            'id' => $allocationType->id,
            'name' => $allocationType ? $allocationType->name : 'Unknown',
            'value' => $allocation->count,
            'totalAmount' => $allocation->total_amount,
            'identifier_title' => $allocationType->identifier->title ?? 'N/A',
        ];
    });

    return response()->json([
        'totalAllocations' => $totalAllocations,
        'allocationType' => $allocationType,
        'registeredFarmers' => $registeredFarmers,
        'unregisteredFarmers' => $unregisteredFarmers,
        'totalFarmers' => $totalFarmers,
        'heatmapData' => $heatmapData,
        'data' => $data,
        'commodityCategories' => $commodityCategories,
        'years' => $years,
        'selectedYear' => $selectedYear,
    ]);
}


      public function allocationTypes()
        {
            $allocationCounts = Allocation::select('allocation_type_id', DB::raw('count(*) as count'))
                ->groupBy('allocation_type_id')
                ->get();

            $data = $allocationCounts->map(function ($allocation) {
                return [
                    'name' => AllocationType::find($allocation->allocation_type_id)->name,
                    'value' => $allocation->count,
                ];
            });

            return response()->json($data);
        }

    public function getAllocationTypeCounts()
    {
        $allocationCounts = Allocation::select('allocation_type_id', DB::raw('count(*) as count'))
            ->groupBy('allocation_type_id')
            ->get();

        // Map the data to include the allocation type name and count
        $data = $allocationCounts->map(function ($allocation) {
            return [
                'name' => AllocationType::find($allocation->allocation_type_id)->name,
                'value' => $allocation->count,
            ];
        });

        return response()->json($data);
    }

    public function commodityCategoryCounts(Request $request)
    {
        $barangayId = $request->query('barangay_id');
        
        $categories = CommodityCategory::with(['commodities'])->get();

        $result = $categories->map(function ($category) use ($barangayId) {
            $commodities = $category->commodities->map(function ($commodity) use ($barangayId) {
                $farmsQuery = Farm::where('commodity_id', $commodity->id);
                
                if ($barangayId && $barangayId !== 'all') {
                    $farmsQuery->where('brgy_id', $barangayId);
                }
                
                return [
                    'commodity_name' => $commodity->name,
                    'commodity_total' => $farmsQuery->count(),
                ];
            });

            return [
                'commodity_category_name' => $category->name,
                'commodity_category_total' => $commodities->sum('commodity_total'),
                'commodities' => $commodities,
            ];
        });

        return response()->json($result);

    }

    public function farmerGenderDistribution(Request $request)
    {
        $barangayId = $request->query('barangay_id');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        // Helper closure for date range filtering
        $applyDateFilter = function($query, $dateColumn = 'created_at') use ($dateFrom, $dateTo) {
            if ($dateFrom && $dateTo) {
                $query->whereBetween($dateColumn, [$dateFrom, $dateTo]);
            } elseif ($dateFrom) {
                $query->whereDate($dateColumn, '>=', $dateFrom);
            } elseif ($dateTo) {
                $query->whereDate($dateColumn, '<=', $dateTo);
            }
            return $query;
        };

        $query = Farmer::query();
        
        if ($barangayId && $barangayId !== 'all') {
            $query->where('brgy_id', $barangayId);
        }
        
        if ($dateFrom || $dateTo) {
            $applyDateFilter($query);
        }

        $maleCount = (clone $query)->where('sex', 'male')->count();
        $femaleCount = (clone $query)->where('sex', 'female')->count();
        $total = $maleCount + $femaleCount;

        return response()->json([
            'male' => $maleCount,
            'female' => $femaleCount,
            'total' => $total,
            'malePercentage' => $total > 0 ? round(($maleCount / $total) * 100, 2) : 0,
            'femalePercentage' => $total > 0 ? round(($femaleCount / $total) * 100, 2) : 0,
        ]);
    }

    public function commodityCounts()
    {
         $categories = CommodityCategory::with(['commodities.farms'])->get();

        $result = $categories->map(function ($category) {
            $commodities = $category->commodities->map(function ($commodity) {
                return [
                    'commodity_name' => $commodity->name,
                    'commodity_total' => $commodity->farms->count(),
                ];
            });

            return [
                'commodity_category_name' => $category->name,
                'commodity_category_total' => $commodities->sum('commodity_total'),
                'commodities' => $commodities,
            ];
        });

        return response()->json($result);
    }

    public function farmerCounts()
    {
        $registeredFarmers = Farmer::where('status', 'registered')->count();
        $unregisteredFarmers = Farmer::where('status', 'unregistered')->count();

        return response()->json([$unregisteredFarmers, $registeredFarmers]);
    }

    public function show(){
        // $year = input->('year');
        $barangays = Barangay::all();
        $allocations = Allocation::all();
        $allocationType = AllocationType::all();
        $commodityCategories = CommodityCategory::with('commodities')->get();
        $registeredFarmers = Farmer::where('status', 'registered')->count();
        $unregisteredFarmers = Farmer::where('status', 'unregistered')->count();
        $totalFarmers = Farmer::count();
        $allocationTypeCounts = Allocation::with('')->get();
        $heatmapData = [];
        $commodityCounts = [];
        $commodityCategoryCounts = [];

        // $allocationCounts = AllocationType::withCount(['allocations' => function ($query) use ($year)
        // { if ($year) { $query->whereYear('created_at', $year); } }])->get();

        // $response = [];
        // foreach ($allocationCounts as $type) {
        //     $response[$type->name] = $type->allocations_count;
        //     return response()->json($response[$type->name]);
        // }

        foreach ($barangays as $barangay) {
            $barangayFarms = Farm::with('farmer')->where('brgy_id', $barangay->id)->get();
            $registeredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer->status === 'registered')->count();
            $unregisteredFarmersInBarangay = $barangayFarms->filter(fn($farm) => $farm->farmer->status === 'unregistered')->count();

            $heatmapData[$barangay->name] = [
                'allocations' => [],
                'commodities' => [],
                'farmers' => [
                    'Registered' => $registeredFarmersInBarangay,
                    'Unregistered' => $unregisteredFarmersInBarangay,
                ],
            ];

            foreach ($allocationType as $type) {
                $count = $allocations->where('allocation_type_id', $type->id)->where('brgy_id', $barangay->id)->count();
                $heatmapData[$barangay->name]['allocations'][$type->name] = $count;
            }

            foreach ($commodityCategories as $category) {

                if (!isset($commodityCounts[$category->name])) {
                    $commodityCounts[$category->name] = [];
                }

                $categoryCommodities = [];
                foreach ($category->commodities as $commodity) {

                    $count = $barangayFarms->filter(function ($farm) use ($commodity) {
                        return $farm->commodity_id === $commodity->id;
                    })->count();

                    $categoryCommodities[] = [
                        'name' => $commodity->name,
                        'count' => $count,
                    ];

                    $heatmapData[$barangay->name]['commodities'][$category->name] = $categoryCommodities;
                    $commodityCounts[$category->name] = $categoryCommodities;
                }
            }

        }

        return response()->json($allocationType);
    }


    public function getCounts(Request $request){
        $year = $request->input('year');

    }

    public function getFarmersDistribution(Request $request)
    {

        $year = $request->input('year');
        $category = $request->input('subcategory', 'all');


        $data = Barangay::withCount([
            'farmers as registered_count' => function ($query) use ($year) {
                $query->where('status', 'registered')
                    ->when($year && $year !== 'all', function ($query) use ($year) {

                        $query->whereYear('registration_date', $year);
                    });
            },
            'farmers as unregistered_count' => function ($query) use ($year) {
                $query->where('status', 'unregistered')
                    ->when($year && $year !== 'all', function ($query) use ($year) {

                        $query->whereYear('registration_date', $year);
                    });
            }
        ])
        ->get()
        ->map(function ($barangay) use ($category) {

            $registeredCount = $barangay->registered_count;
            $unregisteredCount = $barangay->unregistered_count;


            if ($category === 'registered') {
                return [
                    'barangay' => $barangay->name,
                    'value' => [$registeredCount],
                ];
            }

            if ($category === 'unregistered') {
                return [
                    'barangay' => $barangay->name,
                    'value' => [$unregisteredCount],
                ];
            }


            return [
                'barangay' => $barangay->name,
                'value' => [$registeredCount, $unregisteredCount],
            ];
        });

        return response()->json($data);
    }

    public function getAllocationsDistribution(Request $request)
    {
        $year = $request->input('year');
        $category = $request->input('subcategory', 'all');
        $data = Barangay::with(['allocations' => function($query) use ($year, $category) {
            $query->when($category && $category !== 'all', function ($query) use ($category) {
                $query->where('allocation_type_id', $category); // Filter by allocation type
            })
            ->when($year && $year !== 'all', function ($query) use ($year) {
                $query->whereYear('allocations.date_received', $year); // Filter by year
            })
            ->with('allocationType')
            ->selectRaw('brgy_id, allocation_type_id, COUNT(*) as allocation_count')
            ->groupBy('brgy_id', 'allocation_type_id');
        }])
        ->get()
        ->map(function ($barangay) {
            return [
                'barangay' => $barangay->name,
                'allocations' => $barangay->allocations->map(function ($allocation) {
                    return [
                        'allocation_type' => $allocation->allocationType->name,
                        'allocation_count' => $allocation->allocation_count,
                    ];
                }),
            ];
        });
        return response()->json($data);
    }
    protected function getFarmerGroup(Farmer $farmer)
    {

        if ($farmer->is_registered) {
            if ($farmer->age >= 60) {
                return 'seniorCitizen';
            }
            return 'registered';
        }

        if ($farmer->is_pwd) {
            return 'pwd';
        }

        return 'unregistered';
    }
    public function getStackedData()
    {
        return response()->json([
            [
                'category' => 'Category 1',
                'subcategories' => [
                    'Sub1' => 10,
                    'Sub2' => 20,
                    'Sub3' => 30,
                ],
            ],
            [
                'category' => 'Category 2',
                'subcategories' => [
                    'Sub1' => 15,
                    'Sub2' => 25,
                    'Sub3' => 35,
                ],
            ],
        ]);
    }



}
