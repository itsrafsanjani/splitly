<?php

namespace App\Services;

use App\Models\Group;

class BalanceCalculator
{
    /**
     * Calculate balances for all users in a group.
     *
     * Returns an array showing who owes how much to whom.
     *
     * @return array<int, array<int, float>> Array of [debtor_id => [creditor_id => amount]]
     */
    public function calculateGroupBalances(Group $group): array
    {
        $netBalances = $this->calculateNetBalances($group);

        return $this->simplifyBalances($netBalances);
    }

    /**
     * Calculate net balance for each user (positive = owed money, negative = owes money).
     *
     * @return array<int, float> Array of user_id => net_balance
     */
    protected function calculateNetBalances(Group $group): array
    {
        $balances = [];

        foreach ($group->expenses()->with('shares')->get() as $expense) {
            $paidBy = $expense->paid_by;

            if (! isset($balances[$paidBy])) {
                $balances[$paidBy] = 0;
            }

            $balances[$paidBy] += $expense->amount;

            foreach ($expense->shares as $share) {
                if (! isset($balances[$share->user_id])) {
                    $balances[$share->user_id] = 0;
                }

                $balances[$share->user_id] -= $share->share_amount;
            }
        }

        foreach ($group->settlements as $settlement) {
            if (! isset($balances[$settlement->paid_by])) {
                $balances[$settlement->paid_by] = 0;
            }
            if (! isset($balances[$settlement->paid_to])) {
                $balances[$settlement->paid_to] = 0;
            }

            $balances[$settlement->paid_by] -= $settlement->amount;
            $balances[$settlement->paid_to] += $settlement->amount;
        }

        return $balances;
    }

    /**
     * Simplify net balances into who owes whom.
     *
     * @param  array<int, float>  $netBalances
     * @return array<int, array<int, float>>
     */
    protected function simplifyBalances(array $netBalances): array
    {
        $creditors = [];
        $debtors = [];

        foreach ($netBalances as $userId => $balance) {
            if ($balance > 0.01) {
                $creditors[$userId] = round($balance, 2);
            } elseif ($balance < -0.01) {
                $debtors[$userId] = round(abs($balance), 2);
            }
        }

        $settlements = [];

        foreach ($debtors as $debtorId => $debtAmount) {
            foreach ($creditors as $creditorId => $creditAmount) {
                if ($debtAmount <= 0.01) {
                    break;
                }

                $settleAmount = min($debtAmount, $creditAmount);

                if ($settleAmount > 0.01) {
                    if (! isset($settlements[$debtorId])) {
                        $settlements[$debtorId] = [];
                    }

                    $settlements[$debtorId][$creditorId] = round($settleAmount, 2);

                    $debtAmount -= $settleAmount;
                    $creditors[$creditorId] -= $settleAmount;
                }
            }
        }

        return $settlements;
    }
}
