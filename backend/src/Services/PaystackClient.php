<?php

namespace Tundua\Services;

use Yabacon\Paystack;

/**
 * Production wrapper around the Yabacon Paystack SDK.
 *
 * SRP: this class has one reason to change — the Paystack SDK API changes.
 * The rest of the codebase never imports Yabacon\Paystack directly.
 */
class PaystackClient implements PaystackClientInterface
{
    private Paystack $paystack;

    public function __construct(string $secretKey)
    {
        $this->paystack = new Paystack($secretKey);
    }

    public function initialize(array $data): object
    {
        return $this->paystack->transaction->initialize($data);
    }

    public function verify(string $reference): object
    {
        return $this->paystack->transaction->verify(['reference' => $reference]);
    }
}
