<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PriceAlertController extends Controller
{
    /**
     * Danh sách cảnh báo của User hiện tại
     */
    public function index()
    {
        $alerts = Auth::user()->priceAlerts()
            ->orderBy('is_triggered', 'asc') // Ưu tiên các alert chưa kích hoạt
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($alerts);
    }

    /**
     * Lưu một cảnh báo mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'symbol' => 'required|string',
            'target_price' => 'required|numeric|min:0',
            'condition' => 'required|in:above,below',
        ]);

        $alert = Auth::user()->priceAlerts()->create($validated);

        return response()->json([
            'message' => 'Cài đặt cảnh báo thành công!',
            'data' => $alert
        ], 201);
    }

    /**
     * Xóa cảnh báo
     */
    public function destroy($id)
    {
        $alert = Auth::user()->priceAlerts()->findOrFail($id);
        $alert->delete();

        return response()->json(['message' => 'Đã xóa cảnh báo.']);
    }
}