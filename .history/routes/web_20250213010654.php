<?php

use App\Http\Controllers\AdminAllocationController;
use App\Http\Controllers\AdminAllocationTypeController;
use App\Http\Controllers\AdminCommodityController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminFarmController;
use App\Http\Controllers\AdminFarmerController;
use App\Http\Controllers\AdminRecommendationController;
use App\Http\Controllers\AllocationController;
use App\Http\Controllers\AllocationTypeController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\CommodityCategoryController;
use App\Http\Controllers\CommodityController;
use App\Http\Controllers\CropActivityController;
use App\Http\Controllers\CropDamageCauseController;
use App\Http\Controllers\CropDamageImportController;
use App\Http\Controllers\CropDamagesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistributionController;
use App\Http\Controllers\ElligibilityController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\FarmProfileController;
use App\Http\Controllers\FundingController;
use App\Http\Controllers\GeospatialController;
use App\Http\Controllers\IdentifierController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\RetrieverController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UsersController;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Farm;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\AllocationImport;
use App\Imports\CropDamageImport;
use App\Models\Allocation;
use App\Models\CropDamage;
use App\Models\Farmer;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'admin'])->group(function(){
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/report/resource-allocation-breakdown', [AdminRecommendationController::class, 'generateAllocationBreakdownReport']);
    Route::get('/generate-report', [AdminRecommendationController::class, 'generateReport']);

    Route::get('/admin/commoditycategorycounts', [AdminDashboardController::class, 'commodityCategoryCounts']);
    Route::get('/admin/showResponseDashboard', [AdminDashboardController::class, 'showResponseDashboard']);
    Route::get('/admin/allocation-type-counts', [AdminDashboardController::class, 'getAllocationTypeCounts']);

    //new routes
    Route::get('/admin/allocation-type-counts', [AdminDashboardController::class, 'getAllocationTypeCounts']);
    Route::get('/admin/commodity-counts', [AdminDashboardController::class, 'commodityCounts']);
    Route::get('/admin/farmer-counts', [AdminDashboardController::class, 'farmerCounts']);

    //dashboard
    Route::get('/admin/barangays/admin/data', [AdminAllocationController::class, 'showBarangays']);
    Route::get('/admin/allocations/admin/data', [AdminAllocationController::class, 'showAllocations']);
    Route::get('/admin/farmers/admin/data', [FarmerController::class, 'showFarmers'])->name('farmers.data');
    Route::get('/admin/admin/users/data', [UsersController::class, 'showUsers'])->name('users.data');
    Route::get('/admin/admin/heatmap-data', [DashboardController::class, 'getHeatmapData']);

    Route::delete('/admin/cropdamages/destroy/{id}', [CropDamagesController::class, 'destroy']);
    Route::post('/admin/store/cropdamages', [CropDamagesController::class, 'store']);
    Route::post('/admin/cropdamages/update/{id}', [CropDamagesController::class, 'update']);
    Route::get('/admin/cropdamages/data', [CropDamagesController::class, 'showCropDamages']);
    Route::get('/admin/cropdamages/get', [CropDamagesController::class, 'admin'])->name('admin.crop.damages.index');

    //allocation type
    Route::get('/admin/allocation/allocationtype', [AdminAllocationTypeController::class, 'index'])->name('admin.allocation.type.index');
    Route::post('/admin/allocation/store', [AdminAllocationTypeController::class, 'store']);
    Route::delete('/admin/allocation/destroy/{id}', [AdminAllocationTypeController::class, 'destroy']);

    Route::get('/admin/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/admin/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/admin/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //commodity category
    Route::get('/admin/commodity-categories-show', [CommodityCategoryController::class, 'show'])->name('admin.commodity.category.index');
    Route::get('/admin/commodity-categories-list', [CommodityCategoryController::class, 'admin'])->name('admin.commodity.index');
    Route::post('/admin/commodity-categories/store', [CommodityCategoryController::class, 'store']);
    Route::put('/admin/commodities-categories/update/{id}', [CommodityController::class, 'update']);
    Route::delete('/admin/commodity-categories/destroy/{id}', [CommodityCategoryController::class, 'destroy']);


    //commodities/
    Route::put('/admin/commodities/update/{id}', [AdminCommodityController::class, 'update']);
    Route::get('/admin/commodities/show', [AdminCommodityController::class, 'show']);
    Route::post('/admin/commodities/store', [AdminCommodityController::class, 'store']);
    Route::get('/admin/commodities/list', [AdminCommodityController::class, 'index'])->name('admin.commodity.list.index');
    Route::post('/admin/commodities/save', [AdminCommodityController::class, 'store']);
    Route::put('/admin/commodities-categories/update/{id}', [CommodityCategoryController::class, 'update']);
    Route::delete('/admin/commodities/destroy/{id}', [AdminCommodityController::class, 'destroy']);

    //users
    Route::get('/admin/users', [UsersController::class, 'index'])->name('users.index');
    Route::delete('/admin/users/destroy/{id}', [UsersController::class, 'destroy']);
    Route::post('/admin/users/store', [UsersController::class, 'store']);
    Route::put('/admin/users/update/{id}', [UsersController::class, 'update']);

    Route::get('/admin/map/farm', [MapController::class, 'index']);

    //farmprofile
    Route::get('/admin/farmprofile/{id}', [FarmProfileController::class, 'index'])->name('admin.farm.profile.index');
    Route::get('/admin/data/farmprofile/{id}', [FarmProfileController::class, 'show'])->name('admin.farm.profile.index');

    //Farmers
    Route::get('/admin/farmers', [AdminFarmerController::class, 'adminIndex'])->name('admin.farmers.index');
    Route::post('/admin/farmers/store', [AdminFarmerController::class, 'store']);
    Route::put('/admin/farmers/update/{id}', [AdminFarmerController::class, 'update']);
    Route::post('/admin/farmers/update/{id}', [AdminFarmerController::class, 'update']);
    Route::delete('/admin/farmers/destroy/{id}', [AdminFarmerController::class, 'destroy']);

    //farms
    Route::post('/admin/farms/store', [AdminFarmController::class, 'store']);
    // Update an existing farm
    Route::put('/admin/farms/update/{id}', [AdminFarmController::class, 'update']);
    // Delete a farm
    Route::delete('/admin/farms/destroy/{id}', [AdminFarmController::class, 'destroy']);

    //allocations
    Route::get('/admin/allocations', [AdminAllocationController::class, 'admin'])->name('admin.allocations.index');
    Route::delete('/admin/allocations/destroy/{id}', [AdminAllocationController::class, 'destroy']);
    Route::post('/admin/allocations/store', [AdminAllocationController::class, 'store']);
    Route::put('/admin/allocations/update/{id}', [AdminAllocationController::class, 'update']);

   //cropactivity
    Route::get('/admin/cropactivity', [CropActivityController::class, 'showIndex'])->name('admin.crop.activity.index');
    Route::patch('/admin/cropactivity/update/{id}', [CropActivityController::class, 'update']);
    Route::post('/admin/cropactivity/store', [CropActivityController::class, 'store']);
    Route::delete('/admin/cropactivity/destroy/{id}', [CropActivityController::class, 'adminDestroy']);

    //images
    Route::get('/admin/cropactivity/images/{id}', [ImagesController::class, 'adminImages'])->name('admin.crop.activity.images');
    Route::post('/admin/cropactivity/images/store', [ImagesController::class, 'store'])->name('admin.crop.images.activity.store');
    Route::put('/admin/cropactivity/images/update/{id}', [ImagesController::class, 'update'])->name('admin.crop.images.activity.update');
    Route::delete('/admin/images/{id}', [ImagesController::class, 'destroy']);

    Route::get('/admin/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/admin/recommendations', [AdminRecommendationController::class, 'index'])->name('admin.recommendations.index');
    Route::get('/admin/export-pdf', [ExportController::class, 'exportPDF']);
    Route::get('/admin/geospatial', [GeospatialController::class, 'index'])->name('geospatial.index');

    Route::post('/admin/recommend-allocations', [AdminRecommendationController::class, 'recommendAllocations']);
    Route::get('/admin/api/recommend-allocations', [AdminRecommendationController::class, 'recommendAllocations']);
    Route::get('/admin/allocation-types', [AdminRecommendationController::class, 'listAllocationTypes']);

    Route::get('/admin/allocation-types-list', [AdminAllocationTypeController::class, 'show']);
    Route::get('/admin/commodities', [CommodityController::class, 'show']);
    Route::get('/admin/barangays', [BarangayController::class, 'index']);
    Route::get('/admin/crop-damages-causes', [CropDamageCauseController::class, 'admin'])->name('admin.crop.damage.causes');
    Route::get('/admin/crop-damages-ui', [CropDamageCauseController::class, 'admin'])->name('admin.crop.damage.show');
    Route::get('/admin/eligibilities', [ElligibilityController::class, 'index']);

    //crop damage causes
    Route::get('/admin/crop-damage-causes', [CropDamageCauseController::class, 'index']);
    Route::post('/admin/crop-damage-causes/store', [CropDamageCauseController::class, 'store']);
    Route::put('/admin/crop-damage-causes/update/{id}', [CropDamageCauseController::class, 'update']);
    Route::delete('/admin/crop-damage-causes/destroy/{id}', [CropDamageCauseController::class, 'destroy']);

    //allocation type management
    Route::get('/admin/crop-damage-causes', [CropDamageCauseController::class, 'index']);

    Route::get('/admin/api/farmers-distribution', [DistributionController::class, 'getFarmersDistribution']);
    Route::get('/admin/api/farmers', [AdminDashboardController::class, 'getFarmersDistribution']);
    Route::get('/admin/api/allocations', [AdminDashboardController::class, 'getAllocationsDistribution']);
    Route::get('/admin/api/stacked-data', [AdminDashboardController::class, 'getStackedData']);
    Route::get('/admin/allocation-counts', [AdminDashboardController::class, 'getCounts']);

    Route::get('/admin/farmers/data', [AdminFarmerController::class, 'showFarmers']);
     Route::get('/admin/allocations/data', [AdminAllocationController::class, 'showAllocations'])->name('admin.allocations.data');

     Route::get('/admin/allocation-types', [AdminRecommendationController::class, 'listAllocationTypes']);
    Route::get('/admin/data/farmers', [RetrieverController::class, 'farmer']);
    Route::get('/admin/data/barangay', [RetrieverController::class, 'barangay']);
    Route::get('/admin/data/commodity', [RetrieverController::class, 'commodity']);
    Route::get('/admin/data/allocationtype', [RetrieverController::class, 'allocationType']);
    Route::get('/admin/data/cropDamageCause', [RetrieverController::class, 'cropDamageCause']);
    Route::get('/admin/barangays/data', [AdminAllocationController::class, 'showBarangays'])->name('barangay.data');
});

Route::middleware(['auth', 'super admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/report/resource-allocation-breakdown', [RecommendationController::class, 'generateAllocationBreakdownReport']);
    Route::get('/generate-report', [RecommendationController::class, 'generateReport']);

    //new routes
    Route::get('/farms', [FarmController::class, 'index'])->name('farm.index');
    Route::get('/data/farms', [FarmController::class, 'showData']);
    Route::post('/api/import', [ImportController::class, 'import']);
    Route::post('/import-allocations', function (Request $request) {
        $request->validate([
            'file' => 'required|mimes:csv,txt,xlsx',
        ]);
            Excel::import(new AllocationImport, $request->file('file'));
            return back()->with('success', 'Allocations imported successfully!');
        });
    Route::get('/api/check-farmer', [FarmerController::class, 'checkFarmer']);
    Route::get('/api/allocation-type/{id}/dependencies', function ($id) {
        $barangays = Barangay::whereHas('allocationTypes', function ($query) use ($id) {
            $query->where('allocation_type_id', $id);
        })->get();
        $commodities = Commodity::whereHas('allocationTypes', function ($query) use ($id) {
            $query->where('allocation_type_id', $id);
        })->get();

        return response()->json([
            'barangays' => $barangays,
            'commodities' => $commodities
        ]);
    });
    Route::post('/api/allocations/delete', function (Request $request) {
        $ids = $request->input('ids');
        Allocation::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Records deleted successfully'], 200);
    });
     Route::post('/api/cropdamages/delete', function (Request $request) {
        $ids = $request->input('ids');
        CropDamage::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Records deleted successfully'], 200);
    });
     Route::post('/api/farms/delete', function (Request $request) {
        $ids = $request->input('ids');
        Farm::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Records deleted successfully'], 200);
    });
    Route::post('/api/categorycommodities/delete', function (Request $request) {
        $ids = $request->input('ids');
        Farm::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Records deleted successfully'], 200);
    });
    Route::post('/import-crop-damages', function (Request $request) {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        Excel::import(new CropDamageImport, $request->file('file'));

        return back()->with('success', 'Crop damages imported successfully!');
    });
    Route::post('/upload-proof', function (Request $request) {
        $request->validate([
            'proof' => 'required|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        $path = $request->file('proof')->store('proofs', 'public');

        return response()->json(['path' => $path]);
    });

    Route::post('/api/farmers/delete', function (Request $request) {
        $ids = $request->input('ids');
        Farmer::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Records deleted successfully'], 200);
    });

    Route::get('/farms/{farmer_id}', function ($farmer_id) {
        return response()->json(Farm::where('farmer_id', $farmer_id)->get());
    });

    Route::get('/farms/details/{farmId}', function ($farmId) {
    return App\Models\Farm::findOrFail($farmId);
    });


    //funding
    Route::get('/fundings', [FundingController::class, 'index'])->name('funding.index');
    Route::get('/api/fundings', [FundingController::class, 'showFunding']);
    Route::post('/store/fundings', [FundingController::class, 'store']);
    Route::put('/update/fundings/{id}', [FundingController::class, 'update']);
    Route::delete('/destroy/fundings/{id}', [FundingController::class, 'destroy']);

    //identifer
    Route::get('/identifier', [IdentifierController::class, 'index'])->name('identifier.index');
    Route::get('/api/identifier', [IdentifierController::class, 'showFunding']);
    Route::post('/store/identifier', [IdentifierController::class, 'store']);
    Route::put('/update/identifier/{id}', [IdentifierController::class, 'update']);
    Route::delete('/destroy/identifier/{id}', [IdentifierController::class, 'destroy']);

    Route::get('/commoditycategorycounts', [DashboardController::class, 'commodityCategoryCounts']);
    Route::get('/showResponseDashboard', [DashboardController::class, 'showResponseDashboard']);
    Route::get('/allocation-type-counts', [DashboardController::class, 'getAllocationTypeCounts']);


    Route::put('/allocationtypes/update/{id}', [AllocationTypeController::class, 'update']);
    Route::get('/allocation-type-counts', [DashboardController::class, 'allocationTypes']);
    Route::get('/commodity-counts', [DashboardController::class, 'commodityCounts']);
    Route::get('/farmer-counts', [DashboardController::class, 'farmerCounts']);

    //dashboard
    Route::get('/barangays/data', [AllocationController::class, 'showBarangays'])->name('barangay.data');
    Route::get('/allocations/data', [AllocationController::class, 'showAllocations'])->name('allocations.data');
    Route::get('/farmers/data', [FarmerController::class, 'showFarmers'])->name('farmers.data');
    Route::get('/users/data', [UsersController::class, 'showUsers'])->name('users.data');
    Route::get('/heatmap-data', [DashboardController::class, 'getHeatmapData']);

    Route::delete('/cropdamages/destroy/{id}', [CropDamagesController::class, 'destroy'])->name('crop.damages.destroy');
    Route::post('/store/cropdamages', [CropDamagesController::class, 'store'])->name('crop.damages.store');
    Route::post('/cropdamages/update/{id}', [CropDamagesController::class, 'update'])->name('crop.damages.update');
    Route::get('/cropdamages/data', [CropDamagesController::class, 'showCropDamages'])->name('crop.damages.data');
    Route::get('/cropdamages/get', [CropDamagesController::class, 'index'])->name('crop.damages.index');

    //allocation type
    Route::get('/allocation/allocationtype', [AllocationTypeController::class, 'index'])->name('allocation.type.index');
    Route::post('/allocation/store', [AllocationTypeController::class, 'store'])->name('allocation.store');
     Route::delete('/allocation/destroy/{id}', [AdminAllocationTypeController::class, 'destroy'])->name('allocation.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //commodity category
    Route::get('/commodity-categories-show', [CommodityCategoryController::class, 'show'])->name('commodity.category.index');
    Route::get('/commodity-categories-list', [CommodityCategoryController::class, 'index'])->name('commodity.index');
    Route::post('/commodity-categories/store', [CommodityCategoryController::class, 'store']);
    Route::put('/commodities-categories/update/{id}', [CommodityController::class, 'update']);
    Route::delete('/commodity-categories/destroy/{id}', [CommodityCategoryController::class, 'destroy']);

    //commodities/
    Route::put('/commodities/update/{id}', [CommodityController::class, 'update']);
    Route::get('/commodities/show', [CommodityController::class, 'show']);
    Route::post('/commodities/store', [CommodityController::class, 'store'])->name('commodities.store');
    Route::get('/commodities/list', [CommodityController::class, 'index'])->name('commodity.list.index');
    Route::post('/commodities/save', [CommodityController::class, 'store']);
    Route::put('/commodities-categories/update/{id}', [CommodityCategoryController::class, 'update']);
    Route::delete('/commodities/destroy/{id}', [CommodityController::class, 'destroy']);

    //users
    Route::get('/users', [UsersController::class, 'index'])->name('users.index');
    Route::delete('/users/destroy/{id}', [UsersController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/store', [UsersController::class, 'store'])->name('users.store');
    Route::put('/users/update/{id}', [UsersController::class, 'update']);

    Route::get('/map/farm', [MapController::class, 'index'])->name('map.index');

    //farmprofile
    Route::get('/farmprofile/{id}', [FarmProfileController::class, 'index'])->name('farm.profile.index');
    Route::get('/data/farmprofile/{id}', [FarmProfileController::class, 'show'])->name('farm.profile.index');

    //Farmers
    Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
    Route::post('/farmers/store', [FarmerController::class, 'store'])->name('farmers.store');
    Route::put('/farmers/update/{id}', [FarmerController::class, 'update']);
    Route::post('/farmers/update/{id}', [FarmerController::class, 'update']);
    Route::delete('/farmers/destroy/{id}', [FarmerController::class, 'destroy'])->name('farmers.destroy');

    //farms
    Route::post('/farms/store', [FarmController::class, 'store']);
    // Update an existing farm
    Route::put('/farms/update/{id}', [FarmController::class, 'update']);
    // Delete a farm
    Route::delete('/farms/destroy/{id}', [FarmController::class, 'destroy']);

    //allocations
    Route::get('/allocations', [AllocationController::class, 'index'])->name('allocations.index');
    Route::delete('/allocations/destroy/{id}', [AllocationController::class, 'destroy'])->name('allocation.destroy');
    Route::post('/allocations/store', [AllocationController::class, 'store'])->name('allocation.store');
    Route::put('/allocations/update/{id}', [AllocationController::class, 'update'])->name('allocation.update');

   //cropactivity
    Route::get('/cropactivity', [CropActivityController::class, 'index'])->name('crop.activity.index');
    Route::patch('/cropactivity/update/{id}', [CropActivityController::class, 'update'])->name('crop.activity.update');
    Route::delete('/cropactivity/destroy/{id}', [CropActivityController::class, 'destroy'])->name('crop.activity.destroy');
    Route::post('/cropactivity/store', [CropActivityController::class, 'store'])->name('crop.activity.store');
    Route::delete('/cropactivity/destroy/{id}', [CropActivityController::class, 'destroy'])->name('crop.activity.destroy');

    //images
    Route::get('/cropactivity/images/{id}', [ImagesController::class, 'images'])->name('crop.activity.images');
    Route::post('/cropactivity/images/store', [ImagesController::class, 'store'])->name('crop.images.activity.store');
    Route::put('/cropactivity/images/update/{id}', [ImagesController::class, 'update'])->name('crop.images.activity.update');
    Route::delete('/images/{id}', [ImagesController::class, 'destroy']);

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/recommendations', [RecommendationController::class, 'index'])->name('recommendations.index');
    Route::get('/export-pdf', [ExportController::class, 'exportPDF']);
    Route::get('/geospatial', [GeospatialController::class, 'index'])->name('geospatial.index');

    Route::post('/recommend-allocations', [RecommendationController::class, 'recommendAllocations']);
    Route::get('/api/recommend-allocations', [RecommendationController::class, 'recommendAllocations']);
    Route::get('/allocation-types', [RecommendationController::class, 'listAllocationTypes']);

    Route::get('/allocation-types-list', [AdminAllocationTypeController::class, 'show']);
    Route::get('/commodities', [CommodityController::class, 'show']);
    Route::get('/barangays', [BarangayController::class, 'index']);
    Route::get('/crop-damages-causes', [CropDamageCauseController::class, 'index'])->name('crop.damage.causes');
    Route::get('/crop-damages-ui', [CropDamageCauseController::class, 'show'])->name('crop.damage.show');
    Route::get('/eligibilities', [ElligibilityController::class, 'index']);

    //crop damage causes
    Route::get('/crop-damage-causes', [CropDamageCauseController::class, 'index']);
    Route::post('/crop-damage-causes/store', [CropDamageCauseController::class, 'store']);
    Route::put('/crop-damage-causes/update/{id}', [CropDamageCauseController::class, 'update']);
    Route::delete('/crop-damage-causes/destroy/{id}', [CropDamageCauseController::class, 'destroy']);

    //allocation type management
    Route::get('/crop-damage-causes', [CropDamageCauseController::class, 'index']);

    Route::get('/api/farmers-distribution', [DistributionController::class, 'getFarmersDistribution']);
    Route::get('/api/farmers', [DashboardController::class, 'getFarmersDistribution']);
    Route::get('/api/allocations', [DashboardController::class, 'getAllocationsDistribution']);
    Route::get('/api/stacked-data', [DashboardController::class, 'getStackedData']);
    Route::get('/allocation-counts', [DashboardController::class, 'getCounts']);

    Route::get('/data/farmers', [RetrieverController::class, 'farmer']);
    Route::get('/data/barangay', [RetrieverController::class, 'barangay']);
    Route::get('/data/commodity', [RetrieverController::class, 'commodity']);
    Route::get('/data/allocationtype', [RetrieverController::class, 'allocationType']);
    Route::get('/data/cropDamageCause', [RetrieverController::class, 'cropDamageCause']);

});

require __DIR__.'/auth.php';
