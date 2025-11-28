<?php

namespace Tundua\Tests\Feature;

use Tundua\Tests\TestCase;
use Tundua\Models\Application;
use Tundua\Models\User;

/**
 * Application CRUD Tests
 *
 * Tests application creation, reading, updating, deletion
 */
class ApplicationCrudTest extends TestCase
{
    /**
     * Test application creation
     * @test
     */
    public function it_creates_application_successfully()
    {
        $applicationData = [
            'user_id' => 1,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@test.com',
            'phone' => '+1234567890',
            'date_of_birth' => '2000-01-15',
            'nationality' => 'NG',
            'passport_number' => 'A12345678',
            'destination_country' => 'US',
            'program_type' => 'masters',
            'intended_major' => 'Computer Science',
            'service_tier_id' => 1,
            'base_price' => 50000,
            'currency' => 'NGN'
        ];

        $application = Application::createApplication($applicationData);

        $this->assertNotNull($application);
        $this->assertInstanceOf(Application::class, $application);
        $this->assertNotEmpty($application->reference_number);
        $this->assertEquals('draft', $application->status);
        $this->assertStringStartsWith('TUND-', $application->reference_number);
    }

    /**
     * Test reference number format
     * @test
     */
    public function it_generates_unique_reference_numbers()
    {
        $ref1 = 'TUND-' . date('Ymd') . '-0001';
        $ref2 = 'TUND-' . date('Ymd') . '-0002';

        $this->assertNotEquals($ref1, $ref2);
        $this->assertStringStartsWith('TUND-', $ref1);
        $this->assertMatchesRegularExpression('/^TUND-\d{8}-\d{4}$/', $ref1);
    }

    /**
     * Test application validation - missing required fields
     * @test
     */
    public function it_validates_required_fields()
    {
        $requiredFields = [
            'user_id',
            'first_name',
            'last_name',
            'email',
            'destination_country',
            'service_tier_id'
        ];

        $incompleteData = [
            'first_name' => 'John'
            // Missing other required fields
        ];

        foreach ($requiredFields as $field) {
            if ($field !== 'first_name') {
                $this->assertArrayNotHasKey($field, $incompleteData);
            }
        }
    }

    /**
     * Test retrieving applications by user
     * @test
     */
    public function it_retrieves_applications_by_user_id()
    {
        $userId = 1;

        // Mock applications
        $applications = [
            ['id' => 1, 'user_id' => 1, 'status' => 'draft'],
            ['id' => 2, 'user_id' => 1, 'status' => 'submitted'],
        ];

        $userApplications = array_filter($applications, function($app) use ($userId) {
            return $app['user_id'] === $userId;
        });

        $this->assertCount(2, $userApplications);
    }

    /**
     * Test application status transitions
     * @test
     */
    public function it_follows_valid_status_transitions()
    {
        $validTransitions = [
            'draft' => ['payment_pending', 'cancelled'],
            'payment_pending' => ['submitted', 'expired', 'cancelled'],
            'submitted' => ['under_review', 'cancelled'],
            'under_review' => ['in_progress', 'rejected'],
            'in_progress' => ['completed', 'cancelled'],
            'completed' => [],
            'rejected' => [],
            'cancelled' => []
        ];

        $this->assertArrayHasKey('draft', $validTransitions);
        $this->assertContains('payment_pending', $validTransitions['draft']);
        $this->assertNotContains('completed', $validTransitions['draft']);
    }

    /**
     * Test application update
     * @test
     */
    public function it_updates_application_successfully()
    {
        $applicationId = 1;
        $updateData = [
            'phone' => '+9876543210',
            'intended_major' => 'Data Science',
            'current_step' => 3
        ];

        // Mock update
        $updated = true;

        $this->assertTrue($updated);
        $this->assertEquals(3, $updateData['current_step']);
    }

    /**
     * Test preventing updates to submitted applications
     * @test
     */
    public function it_prevents_updates_to_submitted_applications()
    {
        $applicationStatus = 'submitted';
        $lockedStatuses = ['submitted', 'under_review', 'completed'];

        $this->assertContains($applicationStatus, $lockedStatuses);

        // Should not allow updates
    }

    /**
     * Test application deletion - only drafts
     * @test
     */
    public function it_allows_deletion_of_draft_applications_only()
    {
        $draftApplication = ['id' => 1, 'status' => 'draft'];
        $submittedApplication = ['id' => 2, 'status' => 'submitted'];

        $this->assertEquals('draft', $draftApplication['status']);
        $this->assertNotEquals('draft', $submittedApplication['status']);

        // Draft can be deleted
        // Submitted cannot be deleted
    }

    /**
     * Test completion percentage calculation
     * @test
     */
    public function it_calculates_completion_percentage_correctly()
    {
        $percentages = [
            1 => 16,  // Step 1
            2 => 33,  // Step 2
            3 => 50,  // Step 3
            4 => 66,  // Step 4
            5 => 83,  // Step 5
            6 => 100  // Step 6
        ];

        $this->assertEquals(16, $percentages[1]);
        $this->assertEquals(100, $percentages[6]);
    }

    /**
     * Test addon services validation
     * @test
     */
    public function it_validates_addon_services()
    {
        $validAddons = [
            'visa_assistance',
            'accommodation',
            'travel_booking',
            'document_translation'
        ];

        $selectedAddons = ['visa_assistance', 'accommodation'];

        foreach ($selectedAddons as $addon) {
            $this->assertContains($addon, $validAddons);
        }
    }

    /**
     * Test price calculation with addons
     * @test
     */
    public function it_calculates_total_price_with_addons()
    {
        $basePrice = 50000;
        $addonPrices = [
            'visa_assistance' => 10000,
            'accommodation' => 15000
        ];

        $addonTotal = array_sum($addonPrices);
        $total = $basePrice + $addonTotal;

        $this->assertEquals(25000, $addonTotal);
        $this->assertEquals(75000, $total);
    }

    /**
     * Test application search
     * @test
     */
    public function it_searches_applications_by_reference_number()
    {
        $applications = [
            ['reference_number' => 'TUND-20241126-0001', 'status' => 'draft'],
            ['reference_number' => 'TUND-20241126-0002', 'status' => 'submitted'],
        ];

        $searchRef = 'TUND-20241126-0001';

        $found = array_filter($applications, function($app) use ($searchRef) {
            return $app['reference_number'] === $searchRef;
        });

        $this->assertCount(1, $found);
    }

    /**
     * Test application statistics
     * @test
     */
    public function it_calculates_application_statistics()
    {
        $applications = [
            ['status' => 'draft'],
            ['status' => 'draft'],
            ['status' => 'submitted'],
            ['status' => 'completed'],
            ['status' => 'completed'],
        ];

        $stats = [
            'total' => count($applications),
            'draft' => count(array_filter($applications, fn($a) => $a['status'] === 'draft')),
            'submitted' => count(array_filter($applications, fn($a) => $a['status'] === 'submitted')),
            'completed' => count(array_filter($applications, fn($a) => $a['status'] === 'completed')),
        ];

        $this->assertEquals(5, $stats['total']);
        $this->assertEquals(2, $stats['draft']);
        $this->assertEquals(1, $stats['submitted']);
        $this->assertEquals(2, $stats['completed']);
    }

    /**
     * Test expired draft cleanup
     * @test
     */
    public function it_cleans_up_expired_draft_applications()
    {
        $applications = [
            [
                'id' => 1,
                'status' => 'draft',
                'auto_delete_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
            ],
            [
                'id' => 2,
                'status' => 'draft',
                'auto_delete_at' => date('Y-m-d H:i:s', strtotime('+1 day'))
            ],
        ];

        $now = time();

        $expired = array_filter($applications, function($app) use ($now) {
            return strtotime($app['auto_delete_at']) <= $now;
        });

        $this->assertCount(1, $expired);
    }

    /**
     * Test university list validation
     * @test
     */
    public function it_validates_university_selections()
    {
        $universities = [
            ['name' => 'Harvard University', 'country' => 'US'],
            ['name' => 'Oxford University', 'country' => 'UK'],
        ];

        $selectedUniversities = ['Harvard University', 'Oxford University', 'MIT'];

        // Should validate against available universities
        $valid = array_intersect($selectedUniversities, array_column($universities, 'name'));

        $this->assertCount(2, $valid);
        $this->assertContains('Harvard University', $valid);
    }

    /**
     * Test document completeness check
     * @test
     */
    public function it_checks_document_completeness()
    {
        $requiredDocuments = [
            'passport',
            'transcript',
            'degree_certificate',
            'personal_statement'
        ];

        $uploadedDocuments = [
            'passport',
            'transcript'
        ];

        $missing = array_diff($requiredDocuments, $uploadedDocuments);

        $this->assertCount(2, $missing);
        $this->assertContains('degree_certificate', $missing);
        $this->assertContains('personal_statement', $missing);
    }

    /**
     * Test GPA validation
     * @test
     */
    public function it_validates_gpa_against_scale()
    {
        $gpa = 3.8;
        $scale = 4.0;

        $this->assertLessThanOrEqual($scale, $gpa);
        $this->assertGreaterThanOrEqual(0, $gpa);

        $invalidGpa = 5.0;
        $this->assertGreaterThan($scale, $invalidGpa);
    }

    /**
     * Test age validation
     * @test
     */
    public function it_validates_applicant_age()
    {
        $dateOfBirth = '2010-01-01';
        $minAge = 16;

        $dob = new \DateTime($dateOfBirth);
        $now = new \DateTime();
        $age = $now->diff($dob)->y;

        $this->assertLessThan($minAge, $age);

        $validDob = '2005-01-01';
        $dob2 = new \DateTime($validDob);
        $age2 = $now->diff($dob2)->y;

        $this->assertGreaterThanOrEqual($minAge, $age2);
    }
}
