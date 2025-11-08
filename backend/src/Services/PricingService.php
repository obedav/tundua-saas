<?php

namespace Tundua\Services;

use Tundua\Models\ServiceTier;
use Tundua\Models\AddonService;

class PricingService
{
    /**
     * Calculate total price for an application
     *
     * @param int $serviceTierId
     * @param array $addonServiceIds Array of addon service IDs with quantities
     * @param string $discountCode Optional discount code
     * @return array Pricing breakdown
     */
    public static function calculateTotal(
        int $serviceTierId,
        array $addonServiceIds = [],
        ?string $discountCode = null
    ): array {
        try {
            // Get service tier
            $serviceTier = ServiceTier::getById($serviceTierId);

            if (!$serviceTier) {
                return self::errorResponse('Service tier not found');
            }

            $basePrice = (float) $serviceTier->base_price;

            // Calculate add-ons total
            $addonsTotal = 0.00;
            $addonsDetails = [];

            if (!empty($addonServiceIds)) {
                foreach ($addonServiceIds as $addonData) {
                    $addonId = $addonData['id'] ?? $addonData;
                    $quantity = $addonData['quantity'] ?? 1;

                    $addon = AddonService::getById($addonId);

                    if ($addon && $addon->is_active) {
                        $addonPrice = (float) $addon->price;
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
                'service_tier' => [
                    'id' => $serviceTier->id,
                    'name' => $serviceTier->name,
                    'price' => $basePrice
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
                    'currency' => 'USD'
                ]
            ];
        } catch (\Exception $e) {
            error_log("Error calculating pricing: " . $e->getMessage());
            return self::errorResponse('Error calculating pricing');
        }
    }

    /**
     * Validate discount code
     *
     * @param string $code
     * @return array
     */
    private static function validateDiscountCode(string $code): array
    {
        // Hardcoded discount codes for now
        // TODO: Move to database table
        $discountCodes = [
            'WELCOME10' => ['percentage' => 10, 'active' => true, 'description' => '10% off first application'],
            'EARLY20' => ['percentage' => 20, 'active' => true, 'description' => 'Early bird 20% discount'],
            'STUDENT15' => ['percentage' => 15, 'active' => true, 'description' => '15% student discount'],
        ];

        $code = strtoupper($code);

        if (isset($discountCodes[$code]) && $discountCodes[$code]['active']) {
            return [
                'valid' => true,
                'code' => $code,
                'percentage' => $discountCodes[$code]['percentage'],
                'description' => $discountCodes[$code]['description']
            ];
        }

        return [
            'valid' => false,
            'code' => $code,
            'percentage' => 0,
            'description' => 'Invalid or expired discount code'
        ];
    }

    /**
     * Get pricing summary for display
     *
     * @param array $pricingData
     * @return array
     */
    public static function getPricingSummary(array $pricingData): array
    {
        return [
            'base_price' => $pricingData['pricing']['base_price'] ?? 0,
            'addons_count' => count($pricingData['addons'] ?? []),
            'addons_total' => $pricingData['pricing']['addons_total'] ?? 0,
            'subtotal' => $pricingData['pricing']['subtotal'] ?? 0,
            'discount_applied' => ($pricingData['pricing']['discount_amount'] ?? 0) > 0,
            'discount_amount' => $pricingData['pricing']['discount_amount'] ?? 0,
            'tax_amount' => $pricingData['pricing']['tax_amount'] ?? 0,
            'total_amount' => $pricingData['pricing']['total_amount'] ?? 0,
            'currency' => $pricingData['pricing']['currency'] ?? 'USD',
            'formatted_total' => self::formatCurrency($pricingData['pricing']['total_amount'] ?? 0)
        ];
    }

    /**
     * Format currency
     *
     * @param float $amount
     * @param string $currency
     * @return string
     */
    public static function formatCurrency(float $amount, string $currency = 'USD'): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'KES' => 'KSh ',
            'NGN' => '₦',
        ];

        $symbol = $symbols[$currency] ?? '$';

        return $symbol . number_format($amount, 2);
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
     * @return array
     */
    private static function errorResponse(string $message): array
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
                'currency' => 'USD'
            ]
        ];
    }

    /**
     * Get service tier comparison
     *
     * @return array
     */
    public static function getTierComparison(): array
    {
        $tiers = ServiceTier::getActiveTiers();

        $comparison = [];
        foreach ($tiers as $tier) {
            $comparison[] = [
                'id' => $tier['id'],
                'name' => $tier['name'],
                'slug' => $tier['slug'],
                'price' => (float) $tier['base_price'],
                'formatted_price' => self::formatCurrency((float) $tier['base_price']),
                'max_universities' => $tier['max_universities'],
                'features' => $tier['features'],
                'support_level' => $tier['support_level'],
                'includes' => [
                    'essay_review' => $tier['includes_essay_review'],
                    'sop_writing' => $tier['includes_sop_writing'],
                    'visa_support' => $tier['includes_visa_support'],
                    'interview_coaching' => $tier['includes_interview_coaching']
                ],
                'is_featured' => $tier['is_featured']
            ];
        }

        return $comparison;
    }

    /**
     * Get add-ons grouped by category
     *
     * @return array
     */
    public static function getAddonsByCategory(): array
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

            $grouped[$category]['services'][] = [
                'id' => $addon['id'],
                'name' => $addon['name'],
                'slug' => $addon['slug'],
                'description' => $addon['description'],
                'price' => (float) $addon['price'],
                'formatted_price' => self::formatCurrency((float) $addon['price']),
                'delivery_time_days' => $addon['delivery_time_days'],
                'is_featured' => $addon['is_featured']
            ];
        }

        return array_values($grouped);
    }
}
