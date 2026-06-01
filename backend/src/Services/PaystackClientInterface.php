<?php

namespace Tundua\Services;

/**
 * Abstracts the Paystack SDK so PaymentController depends on this contract,
 * not on the concrete SDK class. Enables mocking in tests without real API calls.
 *
 * ISP: only the two methods PaymentController actually uses are declared here.
 * DIP: PaymentController depends on this abstraction, not Yabacon\Paystack.
 */
interface PaystackClientInterface
{
    /**
     * Initialize a new Paystack transaction.
     * Returns an object with ->status (bool) and ->data->authorization_url etc.
     */
    public function initialize(array $data): object;

    /**
     * Verify an existing Paystack transaction by reference.
     * Returns an object with ->status (bool) and ->data->status ('success'|'failed') etc.
     */
    public function verify(string $reference): object;
}
