<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    public function store(StoreMemberRequest $request, Group $group): RedirectResponse
    {
        Gate::authorize('addMember', $group);

        $validated = $request->validated();

        $user = User::firstOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'],
                'password' => Str::random(8)
            ]
        );

        $group->users()->attach($user->id);

        return redirect()->route('groups.show', $group);
    }
}
