<?php

namespace Tundua\Services;

use Tundua\Models\ServiceTier;
use Tundua\Models\AddonService;
use Tundua\Models\DiscountCode;

class PricingService
{
    /**
     * Supported currencies
     */
    public const CURRENCY_NGN = 'NGN';
    public const CURRENCY_USD = 'USD';

    /**
     * Get the current NGN to USD exchange rate
     * Fetches live rate from ExchangeRate-API with 24-hour caching
     * Falls back to EXCHANGE_RATE_NGN_USD env variable if API fails
     */
    public static function getExchangeRate(): float
    {
        return ExchangeRateService::getNgnToUsdRate();
    }

    /**
     * Default currency by country
     */
    private static array $countryToCurrency = [
        'NG' => self::CURRENCY_NGN,
        'Nigeria' => self::CURRENCY_NGN,
    ];

    /**
     * Calculate total price for an application
     *
     * @param int $serviceTierId
     * @param array $addonServiceIds Array of addon service IDs with quantities
     * @param string $discountCode Optional discount code
     * @param string $currency Currency code (NGN or USD)
     * @return array Pricing breakdown
     */
    public static function calculateTotal(
        int $serviceTierId,
        array $addonServiceIds = [],
        ?string $discountCode = null,
        string $currency = self::CURRENCY_NGN
    ): array {
        try {
            // Validate currency
            $currency = in_array($currency, [self::CURRENCY_NGN, self::CURRENCY_USD])
                ? $currency
                : self::CURRENCY_NGN;

            // Get service tier
            $serviceTier = ServiceTier::getById($serviceTierId);

            if (!$serviceTier) {
                return self::errorResponse('Service tier not found', $currency);
            }

            // Check if this is custom pricing (Elite tier)
            if ($serviceTier->is_custom_pricing) {
                return [
                    'success' => true,
                    'is_custom_pricing' => true,
                    'service_tier' => [
                        'id' => $serviceTier->id,
                        'name' => $serviceTier->name,
                        'slug' => $serviceTier->slug,
                        'price' => null,
                        'is_custom_pricing' => true
                    ],
                    'addons' => [],
                    'pricing' => [
                        'base_price' => null,
                        'addons_total' => 0,
                        'subtotal' => null,
                        'discount_code' => null,
                        'discount_percentage' => 0,
                        'discount_amount' => 0,
                        'tax_rate' => 0,
                        'tax_amount' => 0,
                        'total_amount' => null,
                        'currency' => $currency,
                        'requires_quote' => true,
                        'contact_message' => 'Contact us for a personalized quote'
                    ]
                ];
            }

            // Get price based on currency
            $basePrice = self::getPriceForCurrency($serviceTier, $currency);

            // Calculate add-ons total
            $addonsTotal = 0.00;
            $addonsDetails = [];

            if (!empty($addonServiceIds)) {
                foreach ($addonServiceIds as $addonData) {
                    $addonId = $addonData['id'] ?? $addonData;
                    $quantity = $addonData['quantity'] ?? 1;

                    $addon = AddonService::getById($addonId);

                    if ($addon && $addon->is_active) {
                        // Get addon price in the selected currency
                        $addonPrice = self::getAddonPriceForCurrency($addon, $currency);
                        $addonSubtotal = $addonPrice * $quantity;
                        $addonsTotal += $addonSubtotal;

                        $addonsDetails[] = [
                            'id' => $addon->id,
                            'name' => $addon->name,
                            'price' => $addonPrice,
                            'quantity' => $quantity,
                            'subtotal' => $addonSubtotal
                        ];
                    }
                }
            }

            // Calculate subtotal
            $subtotal = $basePrice + $addonsTotal;

            // Apply discount if any
            $discountAmount = 0.00;
            $discountPercentage = 0;

            if ($discountCode) {
                $discount = self::validateDiscountCode($discountCode);
                if ($discount['valid']) {
                    $discountPercentage = $discount['percentage'];
                    $discountAmount = ($subtotal * $discountPercentage) / 100;
                }
            }

            // Calculate tax (if applicable - can be customized based on country)
            $taxRate = 0; // 0% by default, adjust as needed
            $taxAmount = (($subtotal - $discountAmount) * $taxRate) / 100;

            // Calculate total
            $totalAmount = $subtotal - $discountAmount + $taxAmount;

            return [
                'success' => true,
                'is_custom_pricing' => false,
                'service_tier' => [
                    'id' => $serviceTier->id,
                    'name' => $serviceTier->name,
                    'slug' => $serviceTier->slug ?? '',
                    'price' => $basePrice,
                    'is_custom_pricing' => false
                ],
                'addons' => $addonsDetails,
                'pricing' => [
                    'base_price' => round($basePrice, 2),
                    'addons_total' => round($addonsTotal, 2),
                    'subtotal' => round($subtotal, 2),
                    'discount_code' => $discountCode,
                    'discount_percentage' => $discountPercentage,
                    'discount_amount' => round($discountAmount, 2),
                    'tax_rate' => $taxRate,
                    'tax_amount' => round($taxAmount, 2),
                    'total_amount' => round($totalAmount, 2),
                    'currency' => $currency,
                    'formatted_total' => self::formatCurrency($totalAmount, $currency)
                ]
            ];
        } catch (\Exception $e) {
            error_log("Error calculating pricing: " . $e->getMessage());
            return self::errorResponse('Error calculating pricing', $currency);
        }
    }

    /**
     * Get price for a specific currency from service tier
     *
     * @param object $serviceTier
     * @param string $currency
     * @return float
     */
    private static function getPriceForCurrency(object $serviceTier, string $currency): float
    {
        if ($currency === self::CURRENCY_USD) {
            return (float) ($serviceTier->price_usd ?? 0);
        }
        return (float) ($serviceTier->base_price ?? 0);
    }

    /**
     * Get addon price for a specific currency
     * Note: For now, addons use NGN price with conversion for USD
     *
     * @param object $addon
     * @param string $currency
     * @return float
     */
    private static function getAddonPriceForCurrency(object $addon, string $currency): float
    {
        $ngnPrice = (float) $addon->price;

        if ($currency === self::CURRENCY_USD) {
            // Convert NGN to USD using configurable exchange rate
            $exchangeRate = self::getExchangeRate();
            return round($ngnPrice / $exchangeRate, 2);
        }

        return $ngnPrice;
    }

    /**
     * Detect currency based on country code
     *
     * @param string|null $countryCode
     * @return string
     */
    public static function detectCurrency(?string $countryCode): string
    {
        if (!$countryCode) {
            return self::CURRENCY_USD; // Default to USD for unknown
        }

        return self::$countryToCurrency[$countryCode] ?? self::CURRENCY_USD;
    }

    /**
     * Validate discount code
     *
     * @param string $code
     * @param float|null $orderAmount
     * @return array
     */
    private static function validateDiscountCode(string $code, ?float $orderAmount = null): array
    {
        return DiscountCode::validate($code, $orderAmount);
    }

    /**
     * Get pricing summary for display
     *
     * @param array $pricingData
     * @return array
     */
    public static function getPricingSummary(array $pricingData): array
    {
        $currency = $pricingData['pricing']['currency'] ?? self::CURRENCY_NGN;
        $isCustomPricing = $pricingData['is_custom_pricing'] ?? false;

        if ($isCustomPricing) {
            return [
                'is_custom_pricing' => true,
                'requires_quote' => true,
                'currency' => $currency,
                'message' => 'Contact us for a personalized quote'
            ];
        }

        return [
            'is_custom_pricing' => false,
            'base_price' => $pricingData['pricing']['base_price'] ?? 0,
            'addons_count' => count($pricingData['addons'] ?? []),
            'addons_total' => $pricingData['pricing']['addons_total'] ?? 0,
            'subtotal' => $pricingData['pricing']['subtotal'] ?? 0,
            'discount_applied' => ($pricingData['pricing']['discount_amount'] ?? 0) > 0,
            'discount_amount' => $pricingData['pricing']['discount_amount'] ?? 0,
            'tax_amount' => $pricingData['pricing']['tax_amount'] ?? 0,
            'total_amount' => $pricingData['pricing']['total_amount'] ?? 0,
            'currency' => $currency,
            'formatted_total' => self::formatCurrency($pricingData['pricing']['total_amount'] ?? 0, $currency)
        ];
    }

    /**
     * Format currency
     *
     * @param float $amount
     * @param string $currency
     * @return string
     */
    public static function formatCurrency(float $amount, string $currency = self::CURRENCY_NGN): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'KES' => 'KSh ',
            'NGN' => '₦',
        ];

        $symbol = $symbols[$currency] ?? '₦';

        // Nigerian Naira typically doesn't use decimals for whole amounts
        $decimals = ($currency === self::CURRENCY_NGN) ? 0 : 2;

        return $symbol . number_format($amount, $decimals);
    }

    /**
     * Calculate refund amount based on application status
     *
     * @param float $totalPaid
     * @param string $applicationStatus
     * @param int $daysElapsed
     * @return array
     */
    public static function calculateRefund(
        float $totalPaid,
        string $applicationStatus,
        int $daysElapsed
    ): array {
        $refundPercentage = 0;
        $refundReason = '';

        // Refund policy logic
        if ($applicationStatus === 'draft' || $applicationStatus === 'payment_pending') {
            $refundPercentage = 100;
            $refundReason = 'Full refund - Application not submitted';
        } elseif ($applicationStatus === 'submitted' && $daysElapsed <= 7) {
            $refundPercentage = 90;
            $refundReason = '90% refund - Within 7 days of submission';
        } elseif ($applicationStatus === 'submitted' && $daysElapsed <= 14) {
            $refundPercentage = 50;
            $refundReason = '50% refund - Within 14 days of submission';
        } elseif ($applicationStatus === 'under_review') {
            $refundPercentage = 25;
            $refundReason = '25% refund - Application under review';
        } else {
            $refundPercentage = 0;
            $refundReason = 'No refund - Application in progress or completed';
        }

        $refundAmount = ($totalPaid * $refundPercentage) / 100;

        return [
            'refund_eligible' => $refundPercentage > 0,
            'refund_percentage' => $refundPercentage,
            'refund_amount' => round($refundAmount, 2),
            'refund_reason' => $refundReason,
            'original_amount' => $totalPaid
        ];
    }

    /**
     * Error response helper
     *
     * @param string $message
     * @param string $currency
     * @return array
     */
    private static function errorResponse(string $message, string $currency = self::CURRENCY_NGN): array
    {
        return [
            'success' => false,
            'error' => $message,
            'pricing' => [
                'base_price' => 0,
                'addons_total' => 0,
                'subtotal' => 0,
                'discount_amount' => 0,
                'tax_amount' => 0,
                'total_amount' => 0,
                'currency' => $currency
            ]
        ];
    }

    /**
     * Get service tier comparison with multi-currency support
     *
     * @param string $currency
     * @return array
     */
    public static function getTierComparison(string $currency = self::CURRENCY_NGN): array
    {
        $tiers = ServiceTier::getActiveTiers();

        $comparison = [];
        foreach ($tiers as $tier) {
            $isCustomPricing = (bool) ($tier['is_custom_pricing'] ?? false);

            // Get price based on currency
            $price = null;
            $formattedPrice = null;

            if (!$isCustomPricing) {
                if ($currency === self::CURRENCY_USD) {
                    $price = (float) ($tier['price_usd'] ?? 0);
                } else {
                    $price = (float) ($tier['base_price'] ?? 0);
                }
                $formattedPrice = self::formatCurrency($price, $currency);
            }

            $comparison[] = [
                'id' => $tier['id'],
                'name' => $tier['name'],
                'slug' => $tier['slug'],
                'description' => $tier['description'] ?? '',
                'price' => $price,
                'price_ngn' => (float) ($tier['base_price'] ?? 0),
                'price_usd' => (float) ($tier['price_usd'] ?? 0),
                'formatted_price' => $formattedPrice,
                'formatted_price_ngn' => !$isCustomPricing ? self::formatCurrency((float) ($tier['base_price'] ?? 0), self::CURRENCY_NGN) : null,
                'formatted_price_usd' => !$isCustomPricing ? self::formatCurrency((float) ($tier['price_usd'] ?? 0), self::CURRENCY_USD) : null,
                'is_custom_pricing' => $isCustomPricing,
                'billing_type' => $tier['billing_type'] ?? 'one_time',
                'max_universities' => $tier['max_universities'],
                'features' => is_string($tier['features']) ? json_decode($tier['features'], true) : $tier['features'],
                'support_level' => $tier['support_level'],
                'includes' => [
                    'essay_review' => (bool) $tier['includes_essay_review'],
                    'sop_writing' => (bool) $tier['includes_sop_writing'],
                    'visa_support' => (bool) $tier['includes_visa_support'],
                    'interview_coaching' => (bool) $tier['includes_interview_coaching']
                ],
                'is_featured' => (bool) $tier['is_featured']
            ];
        }

        return $comparison;
    }

    /**
     * Get add-ons grouped by category with multi-currency support
     *
     * @param string $currency
     * @return array
     */
    public static function getAddonsByCategory(string $currency = self::CURRENCY_NGN): array
    {
        $addons = AddonService::getActiveAddons();

        $grouped = [];
        foreach ($addons as $addon) {
            $category = $addon['category'] ?? 'other';

            if (!isset($grouped[$category])) {
                $grouped[$category] = [
                    'category' => $category,
                    'category_label' => ucfirst($category),
                    'services' => []
                ];
            }

            // Convert price if USD
            $price = (float) $addon['price'];
            if ($currency === self::CURRENCY_USD) {
                $price = round($price / self::getExchangeRate(), 2);
            }

            $grouped[$category]['services'][] = [
                'id' => $addon['id'],
                'name' => $addon['name'],
                'slug' => $addon['slug'],
                'description' => $addon['description'],
                'price' => $price,
                'formatted_price' => self::formatCurrency($price, $currency),
                'delivery_time_days' => $addon['delivery_time_days'],
                'is_featured' => $addon['is_featured']
            ];
        }

        return array_values($grouped);
    }

    /**
     * Calculate installment plans for payment
     *
     * @param float $totalAmount Total amount to be paid
     * @param int $installments Number of installments (2 or 3)
     * @param string $currency Currency code
     * @return array Installment breakdown
     */
    public static function calculateInstallmentPlan(float $totalAmount, int $installments = 2, string $currency = self::CURRENCY_NGN): array
    {
        // Validate installments
        if (!in_array($installments, [2, 3])) {
            return [
                'success' => false,
                'error' => 'Invalid number of installments. Only 2 or 3 installments supported.',
            ];
        }

        // Minimum amount for installments varies by currency
        $minimumAmount = $currency === self::CURRENCY_USD ? 50.00 : 100000.00;

        if ($totalAmount < $minimumAmount) {
            return [
                'success' => false,
                'error' => 'Installment plans available for amounts ' . self::formatCurrency($minimumAmount, $currency) . ' and above only.',
                'minimum_amount' => $minimumAmount
            ];
        }

        // Calculate installment amounts
        // First payment is typically higher (50% for 2 installments, 40% for 3 installments)
        $firstPaymentPercentage = ($installments === 2) ? 50 : 40;
        $firstPayment = round(($totalAmount * $firstPaymentPercentage) / 100, 2);
        $remainingAmount = $totalAmount - $firstPayment;
        $subsequentPayment = round($remainingAmount / ($installments - 1), 2);

        // Adjust for rounding differences
        $calculatedTotal = $firstPayment + ($subsequentPayment * ($installments - 1));
        $difference = $totalAmount - $calculatedTotal;
        if (abs($difference) > 0) {
            $firstPayment += $difference;
        }

        $plan = [
            'success' => true,
            'total_amount' => $totalAmount,
            'installments' => $installments,
            'currency' => $currency,
            'payments' => []
        ];

        // First payment (due immediately)
        $plan['payments'][] = [
            'payment_number' => 1,
            'amount' => $firstPayment,
            'formatted_amount' => self::formatCurrency($firstPayment, $currency),
            'percentage' => $firstPaymentPercentage,
            'due_description' => 'Due at booking (to start application process)',
            'due_days_from_booking' => 0
        ];

        // Subsequent payments
        $daysInterval = ($installments === 2) ? 30 : 21; // 30 days for 2 installments, 21 days for 3
        for ($i = 2; $i <= $installments; $i++) {
            $dueDate = ($i - 1) * $daysInterval;
            $percentageRemaining = round((($subsequentPayment / $totalAmount) * 100), 1);

            $plan['payments'][] = [
                'payment_number' => $i,
                'amount' => $subsequentPayment,
                'formatted_amount' => self::formatCurrency($subsequentPayment, $currency),
                'percentage' => $percentageRemaining,
                'due_description' => "Due {$dueDate} days after booking",
                'due_days_from_booking' => $dueDate
            ];
        }

        // Add summary
        $plan['summary'] = [
            'first_payment' => self::formatCurrency($firstPayment, $currency),
            'subsequent_payments' => self::formatCurrency($subsequentPayment, $currency),
            'total_payable' => self::formatCurrency($totalAmount, $currency),
            'payment_schedule' => $installments === 2
                ? 'Pay 50% now, 50% in 30 days'
                : 'Pay 40% now, 30% in 21 days, 30% in 42 days'
        ];

        return $plan;
    }

    /**
     * Get available installment options for an amount
     *
     * @param float $totalAmount
     * @param string $currency
     * @return array
     */
    public static function getInstallmentOptions(float $totalAmount, string $currency = self::CURRENCY_NGN): array
    {
        $minimumAmount = $currency === self::CURRENCY_USD ? 50.00 : 100000.00;

        if ($totalAmount < $minimumAmount) {
            return [
                'available' => false,
                'reason' => 'Amount below minimum threshold',
                'minimum_required' => $minimumAmount,
                'formatted_minimum' => self::formatCurrency($minimumAmount, $currency),
                'options' => []
            ];
        }

        return [
            'available' => true,
            'minimum_required' => $minimumAmount,
            'formatted_minimum' => self::formatCurrency($minimumAmount, $currency),
            'options' => [
                [
                    'installments' => 2,
                    'label' => '2 Installments',
                    'description' => 'Pay 50% now, 50% in 30 days',
                    'plan' => self::calculateInstallmentPlan($totalAmount, 2, $currency)
                ],
                [
                    'installments' => 3,
                    'label' => '3 Installments',
                    'description' => 'Pay 40% now, then 2 more payments over 42 days',
                    'plan' => self::calculateInstallmentPlan($totalAmount, 3, $currency)
                ]
            ]
        ];
    }
}
