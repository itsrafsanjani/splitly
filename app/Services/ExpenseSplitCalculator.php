<?php

namespace App\Services;

class ExpenseSplitCalculator
{
    /**
     * Calculate shares for an expense based on split type.
     *
     * @param  float  $amount  Total expense amount
     * @param  string  $splitType  Type of split (equal, exact, percentage, shares)
     * @param  array<int, mixed>  $participants  Array of user IDs or user IDs with their split values
     * @return array<int, float> Array of user_id => share_amount
     */
    public function calculate(float $amount, string $splitType, array $participants): array
    {
        return match ($splitType) {
            'equal' => $this->calculateEqual($amount, $participants),
            'exact' => $this->calculateExact($participants),
            'percentage' => $this->calculatePercentage($amount, $participants),
            'shares' => $this->calculateShares($amount, $participants),
            default => throw new \InvalidArgumentException("Invalid split type: {$splitType}"),
        };
    }

    /**
     * Split equally among all participants.
     *
     * @param  array<int>  $participants  Array of user IDs
     */
    protected function calculateEqual(float $amount, array $participants): array
    {
        $count = count($participants);
        if ($count === 0) {
            return [];
        }

        $shareAmount = round($amount / $count, 2);
        $shares = [];

        foreach ($participants as $userId) {
            $shares[$userId] = $shareAmount;
        }

        $total = array_sum($shares);
        $difference = round($amount - $total, 2);

        if ($difference != 0) {
            $firstUserId = array_key_first($shares);
            $shares[$firstUserId] += $difference;
        }

        return $shares;
    }

    /**
     * Use exact amounts specified for each participant.
     *
     * @param  array<int, float>  $participants  Array of user_id => exact_amount
     */
    protected function calculateExact(array $participants): array
    {
        return array_map(fn ($amount) => round($amount, 2), $participants);
    }

    /**
     * Split by percentage.
     *
     * @param  array<int, float>  $participants  Array of user_id => percentage
     */
    protected function calculatePercentage(float $amount, array $participants): array
    {
        $shares = [];

        foreach ($participants as $userId => $percentage) {
            $shares[$userId] = round(($amount * $percentage) / 100, 2);
        }

        $total = array_sum($shares);
        $difference = round($amount - $total, 2);

        if ($difference != 0) {
            $firstUserId = array_key_first($shares);
            $shares[$firstUserId] += $difference;
        }

        return $shares;
    }

    /**
     * Split by shares/units.
     *
     * @param  array<int, int>  $participants  Array of user_id => number_of_shares
     */
    protected function calculateShares(float $amount, array $participants): array
    {
        $totalShares = array_sum($participants);
        if ($totalShares === 0) {
            return [];
        }

        $shares = [];

        foreach ($participants as $userId => $userShares) {
            $shares[$userId] = round(($amount * $userShares) / $totalShares, 2);
        }

        $total = array_sum($shares);
        $difference = round($amount - $total, 2);

        if ($difference != 0) {
            $firstUserId = array_key_first($shares);
            $shares[$firstUserId] += $difference;
        }

        return $shares;
    }
}
