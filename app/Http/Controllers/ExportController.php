<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Maatwebsite\Excel\Facades\Excel;
use PDF;

class ExportController extends Controller
{
    public function exportExcel()
    {
        return Excel::download(new DataExport, 'dashboard_data.xlsx');
    }

    public function exportPDF()
{
    $data = [
        'title' => 'Dashboard Data',
        'data' => [
            ['Category' => 'Barangay A', 'Rice' => 120, 'Corn' => 80, 'Fisheries' => 50],
            ['Category' => 'Barangay B', 'Rice' => 100, 'Corn' => 60, 'Fisheries' => 70],
            ['Category' => 'Barangay C', 'Rice' => 150, 'Corn' => 90, 'Fisheries' => 30],
        ]
    ];

    $pdf = PDF::loadView('pdf.dashboard', $data);
    return $pdf->download('dashboard_data.pdf');
}
}