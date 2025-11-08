# Financial Components
$financialComponents = @(
    'BillingHistory',
    'PaymentMethods',
    'RefundCenter',
    'InvoiceDownload'
)

# AddOns Components
$addOnsComponents = @(
    'AvailableAddOns',
    'MyAddOnsList',
    'AddOnPurchaseModal',
    'PostPaymentAddOns'
)

# Resources Components
$resourcesComponents = @(
    'KnowledgeBaseWidget',
    'UniversityResources',
    'EmbassyDirectory',
    'FAQSection'
)

# Settings Components
$settingsComponents = @(
    'ProfileSettings',
    'NotificationPreferences',
    'PasswordChange',
    'AccountDeletion'
)

# Onboarding Components
$onboardingComponents = @(
    'WelcomeWizard',
    'QuickStartChecklist',
    'TourGuide'
)

Write-Host "Component structure creation script ready"
Write-Host "Total components to create: $($financialComponents.Count + $addOnsComponents.Count + $resourcesComponents.Count + $settingsComponents.Count + $onboardingComponents.Count)"
