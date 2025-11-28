<?php

namespace Tundua\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    private PHPMailer $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
        $this->configure();
    }

    /**
     * Configure PHPMailer
     */
    private function configure(): void
    {
        try {
            // Server settings
            $this->mailer->isSMTP();
            $this->mailer->Host = $_ENV['MAIL_HOST'] ?? 'smtp.gmail.com';
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $_ENV['MAIL_USERNAME'] ?? '';
            $this->mailer->Password = $_ENV['MAIL_PASSWORD'] ?? '';
            $this->mailer->SMTPSecure = $_ENV['MAIL_ENCRYPTION'] ?? 'tls';
            $this->mailer->Port = (int)($_ENV['MAIL_PORT'] ?? 587);

            // Sender
            $fromAddress = $_ENV['MAIL_FROM_ADDRESS'] ?? 'noreply@tundua.com';
            $fromName = $_ENV['MAIL_FROM_NAME'] ?? 'Tundua Education';
            $this->mailer->setFrom($fromAddress, $fromName);

            // Email format
            $this->mailer->isHTML(true);
            $this->mailer->CharSet = 'UTF-8';
        } catch (Exception $e) {
            error_log("Email configuration failed: " . $e->getMessage());
        }
    }

    /**
     * Send email
     */
    private function send(string $to, string $subject, string $body): bool
    {
        try {
            $this->mailer->addAddress($to);
            $this->mailer->Subject = $subject;
            $this->mailer->Body = $body;

            $result = $this->mailer->send();

            // Clear addresses for next email
            $this->mailer->clearAddresses();

            return $result;
        } catch (Exception $e) {
            error_log("Email send failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send verification email
     */
    public function sendVerificationEmail(string $email, string $firstName, string $verificationUrl): bool
    {
        $subject = "Verify Your Email - Tundua";

        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Welcome to Tundua!</h1>
                </div>
                <div class='content'>
                    <h2>Hi {$firstName},</h2>
                    <p>Thank you for registering with Tundua, your trusted partner for study abroad applications.</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <div style='text-align: center;'>
                        <a href='{$verificationUrl}' class='button'>Verify Email Address</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style='word-break: break-all; color: #0ea5e9;'>{$verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account with Tundua, you can safely ignore this email.</p>
                    <p>Best regards,<br>The Tundua Team</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Tundua Education. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $body);
    }

    /**
     * Send password reset email
     */
    public function sendPasswordResetEmail(string $email, string $firstName, string $resetUrl): bool
    {
        $subject = "Reset Your Password - Tundua";

        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Password Reset Request</h1>
                </div>
                <div class='content'>
                    <h2>Hi {$firstName},</h2>
                    <p>We received a request to reset your password for your Tundua account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style='text-align: center;'>
                        <a href='{$resetUrl}' class='button'>Reset Password</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style='word-break: break-all; color: #0ea5e9;'>{$resetUrl}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <div class='warning'>
                        <strong>Security Note:</strong> If you didn't request a password reset, please ignore this email and your password will remain unchanged. For security, we recommend changing your password if you suspect unauthorized access.
                    </div>
                    <p>Best regards,<br>The Tundua Team</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Tundua Education. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $body);
    }

    /**
     * Send welcome email after email verification
     */
    public function sendWelcomeEmail(string $email, string $firstName): bool
    {
        $subject = "Welcome to Tundua - Let's Get Started!";

        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0ea5e9; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Welcome to Tundua!</h1>
                </div>
                <div class='content'>
                    <h2>Hi {$firstName},</h2>
                    <p>Your email has been verified! You're all set to start your study abroad journey.</p>

                    <h3>What's Next?</h3>

                    <div class='feature'>
                        <strong>1. Start Your Application</strong>
                        <p>Choose from our Standard, Premium, or Concierge packages and apply to your dream universities.</p>
                    </div>

                    <div class='feature'>
                        <strong>2. Upload Documents</strong>
                        <p>Securely upload your academic documents, passport, and test scores.</p>
                    </div>

                    <div class='feature'>
                        <strong>3. Track Your Progress</strong>
                        <p>Monitor your application status in real-time from your dashboard.</p>
                    </div>

                    <div style='text-align: center;'>
                        <a href='" . ($_ENV['APP_URL'] ?? 'http://localhost:3000') . "/dashboard' class='button'>Go to Dashboard</a>
                    </div>

                    <p>Need help? Our support team is here for you 24/7.</p>

                    <p>Best regards,<br>The Tundua Team</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Tundua Education. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $body);
    }

    /**
     * Send application submitted email (static wrapper for ApplicationController)
     */
    public static function sendApplicationSubmitted($application): bool
    {
        try {
            // Get user data using PDO model (not Eloquent)
            $userModel = new \Tundua\Models\User();
            $user = $userModel->findById($application->user_id);

            if (!$user) {
                error_log("User not found for application submission email: " . $application->user_id);
                return false;
            }

            // Create instance and send
            $emailService = new self();
            return $emailService->sendApplicationConfirmation(
                $user['email'],
                $user['first_name'],
                $application->reference_number
            );
        } catch (\Exception $e) {
            error_log("Error sending application submitted email: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send application submitted confirmation email
     */
    public function sendApplicationConfirmation(string $email, string $firstName, string $referenceNumber): bool
    {
        $subject = "Application Submitted - {$referenceNumber}";

        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .reference { background: white; padding: 20px; text-align: center; border: 2px dashed #0ea5e9; border-radius: 10px; margin: 20px 0; }
                .reference h2 { color: #0ea5e9; margin: 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>✅ Application Submitted Successfully!</h1>
                </div>
                <div class='content'>
                    <h2>Hi {$firstName},</h2>
                    <p>Great news! Your application has been successfully submitted.</p>

                    <div class='reference'>
                        <p style='margin: 0; color: #666;'>Your Reference Number</p>
                        <h2>{$referenceNumber}</h2>
                        <p style='margin: 0; color: #666; font-size: 12px;'>Please save this for your records</p>
                    </div>

                    <h3>What Happens Next?</h3>
                    <ol>
                        <li><strong>Document Review</strong> - Our team will review your documents within 24-48 hours</li>
                        <li><strong>Application Processing</strong> - We'll prepare and submit your applications to universities</li>
                        <li><strong>Status Updates</strong> - You'll receive email notifications at every step</li>
                    </ol>

                    <p>You can track your application status anytime in your dashboard.</p>

                    <p>Best regards,<br>The Tundua Team</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Tundua Education. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $body);
    }

    /**
     * Send payment reminder email (static wrapper for cron job)
     */
    public static function sendPaymentReminder(array $application, int $hoursRemaining): bool
    {
        try {
            $emailService = new self();
            return $emailService->sendPaymentReminderEmail(
                $application['email'],
                $application['first_name'] ?? 'there',
                $application['reference_number'],
                $hoursRemaining,
                $application['total_amount'] ?? 0
            );
        } catch (\Exception $e) {
            error_log("Error sending payment reminder email: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send payment reminder email
     */
    private function sendPaymentReminderEmail(
        string $email,
        string $firstName,
        string $referenceNumber,
        int $hoursRemaining,
        float $amount
    ): bool {
        $subject = "⏰ Payment Reminder - Application {$referenceNumber}";

        $urgency = $hoursRemaining <= 12 ? 'URGENT: Only ' : '';
        $hoursText = $hoursRemaining === 1 ? '1 hour' : "{$hoursRemaining} hours";

        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
                .amount { background: white; padding: 20px; text-align: center; border: 2px solid #0ea5e9; border-radius: 10px; margin: 20px 0; }
                .amount h2 { color: #0ea5e9; margin: 0; }
                .countdown { font-size: 32px; font-weight: bold; color: #ef4444; text-align: center; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>⏰ Payment Reminder</h1>
                </div>
                <div class='content'>
                    <h2>Hi {$firstName},</h2>
                    <p>This is a friendly reminder about your pending application payment.</p>

                    <div class='countdown'>
                        {$urgency}{$hoursText} remaining
                    </div>

                    <div class='warning'>
                        <strong>⚠️ Important:</strong> Your application <strong>{$referenceNumber}</strong> will be automatically deleted in <strong>{$hoursText}</strong> if payment is not received. Please complete your payment to secure your application.
                    </div>

                    <div class='amount'>
                        <p style='margin: 0; color: #666;'>Amount Due</p>
                        <h2>\${$amount}</h2>
                        <p style='margin: 0; color: #666; font-size: 12px;'>Reference: {$referenceNumber}</p>
                    </div>

                    <h3>Why am I receiving this?</h3>
                    <ul>
                        <li>You started an application but haven't completed payment</li>
                        <li>We keep draft applications for 72 hours to give you time to pay</li>
                        <li>After 72 hours, unpaid applications are automatically deleted</li>
                    </ul>

                    <div style='text-align: center;'>
                        <a href='" . ($_ENV['APP_URL'] ?? 'http://localhost:3000') . "/dashboard/applications/{$referenceNumber}/payment' class='button'>Complete Payment Now</a>
                    </div>

                    <p><strong>What happens if I don't pay?</strong></p>
                    <p>If payment is not received within {$hoursText}, your application will be permanently deleted and you'll need to start over.</p>

                    <p>Need help? Contact our support team at support@tundua.com</p>

                    <p>Best regards,<br>The Tundua Team</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2025 Tundua Education. All rights reserved.</p>
                    <p>This is an automated reminder. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $this->send($email, $subject, $body);
    }
}
