<?php

use App\Services\ExpenseSplitCalculator;

test('calculates equal split correctly', function () {
    $calculator = new ExpenseSplitCalculator;
    $shares = $calculator->calculate(100, 'equal', [1, 2, 3]);

    expect(round(array_sum($shares), 2))->toBe(100.0);
    expect($shares)->toHaveCount(3);
});

test('calculates exact split correctly', function () {
    $calculator = new ExpenseSplitCalculator;
    $shares = $calculator->calculate(0, 'exact', [1 => 30.50, 2 => 45.25, 3 => 24.25]);

    expect($shares[1])->toBe(30.50);
    expect($shares[2])->toBe(45.25);
    expect($shares[3])->toBe(24.25);
});

test('calculates percentage split correctly', function () {
    $calculator = new ExpenseSplitCalculator;
    $shares = $calculator->calculate(100, 'percentage', [1 => 50, 2 => 30, 3 => 20]);

    expect(array_sum($shares))->toBe(100.0);
    expect($shares[1])->toBe(50.0);
    expect($shares[2])->toBe(30.0);
    expect($shares[3])->toBe(20.0);
});

test('calculates shares split correctly', function () {
    $calculator = new ExpenseSplitCalculator;
    $shares = $calculator->calculate(100, 'shares', [1 => 2, 2 => 1, 3 => 1]);

    expect(array_sum($shares))->toBe(100.0);
    expect($shares[1])->toBe(50.0);
    expect($shares[2])->toBe(25.0);
    expect($shares[3])->toBe(25.0);
});

test('handles rounding differences in equal split', function () {
    $calculator = new ExpenseSplitCalculator;
    $shares = $calculator->calculate(100, 'equal', [1, 2, 3]);

    expect(round(array_sum($shares), 2))->toBe(100.0);
});
