<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSettlementRequest;
use App\Models\Settlement;
use Illuminate\Http\RedirectResponse;

class SettlementController extends Controller
{
    public function store(StoreSettlementRequest $request): RedirectResponse
    {
        $data = $request->validated();

        Settlement::create([
            'group_id' => $data['group_id'],
            'paid_by' => auth()->id(),
            'paid_to' => $data['paid_to'],
            'amount' => $data['amount'],
            'settled_at' => now(),
        ]);

        return redirect()->route('groups.show', $data['group_id']);
    }
}
