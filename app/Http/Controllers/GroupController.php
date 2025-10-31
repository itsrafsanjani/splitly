<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Group;
use App\Services\BalanceCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    public function __construct(protected BalanceCalculator $balanceCalculator) {}

    public function index(): Response
    {
        $groups = auth()->user()->groups()->with('users')->withCount('expenses')->get();

        return Inertia::render('Groups/Index', [
            'groups' => $groups,
        ]);
    }

    public function show(Group $group): Response
    {
        Gate::authorize('view', $group);

        $group->load([
            'users',
            'expenses.payer',
            'expenses.shares.user',
            'expenses.comments.user',
        ]);
        $balances = $this->balanceCalculator->calculateGroupBalances($group);

        return Inertia::render('Groups/Show', [
            'group' => $group,
            'balances' => $balances,
        ]);
    }

    public function store(StoreGroupRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('groups', 'public');
        }

        $group = Group::create($data);

        $members = array_unique(array_merge($data['members'], [auth()->id()]));
        $group->users()->attach($members);

        return redirect()->route('groups.show', $group);
    }

    public function update(UpdateGroupRequest $request, Group $group): RedirectResponse
    {
        Gate::authorize('update', $group);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($group->image) {
                Storage::disk('public')->delete($group->image);
            }
            $data['image'] = $request->file('image')->store('groups', 'public');
        }

        $group->update($data);

        return redirect()->route('groups.show', $group);
    }

    public function destroy(Group $group): RedirectResponse
    {
        Gate::authorize('delete', $group);

        if ($group->image) {
            Storage::disk('public')->delete($group->image);
        }

        $group->delete();

        return redirect()->route('groups.index');
    }
}
