<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use Illuminate\Http\Request;

class DistributionController extends Controller
{
    public function getFarmersDistribution()
    {
       
        $data = [
            [
                'group' => 'PWD', 
                'values' => Farmer::where('pwd', 'yes')->pluck('age')->toArray(),
                'interpretation' => 'PWD farmers tend to be older due to limited access to agricultural resources. Support for PWD farmers is necessary.',
                'recommendations' => [
                    'Provide accessible farming tools and resources for PWD farmers.',
                    'Create outreach programs focusing on PWD farmers in the rural areas.'
                ]
            ],
            [
                'group' => '4Ps',
                'values' => Farmer::where('4ps', 'yes')->pluck('age')->toArray(),
                'interpretation' => 'Farmers under the 4Ps program are younger, often benefiting from government assistance. More programs should target this group.',
                'recommendations' => [
                    'Increase access to modern farming techniques for 4Ps beneficiaries.',
                    'Offer training for 4Ps farmers to improve agricultural yields.'
                ]
            ],
            [
                'group' => 'Registered',
                'values' => Farmer::where('status', 'registered')->pluck('age')->toArray(),
                'interpretation' => 'Registered farmers are more likely to have stable access to resources. Targeted interventions can help optimize their agricultural output.',
                'recommendations' => [
                    'Strengthen support and subsidies for registered farmers.',
                    'Encourage the registration of more farmers to provide access to government programs.'
                ]
            ],
            [
                'group' => 'Unregistered',
                'values' => Farmer::where('status', 'unregistered')->pluck('age')->toArray(),
                'interpretation' => 'Unregistered farmers often face challenges accessing resources and government programs.',
                'recommendations' => [
                    'Implement outreach programs to register unregistered farmers.',
                    'Offer incentives for farmers to become registered and access government services.'
                ]
            ]
        ];

        // Return the aggregated data as JSON
        return response()->json($data);
    }
}