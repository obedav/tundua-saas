@echo off
REM Test all cron jobs manually (Windows)
REM Usage: double-click this file or run: test-cron-jobs.bat

echo ==========================================
echo TUNDUA CRON JOBS - MANUAL TEST
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Testing Cleanup Unpaid Applications...
echo ------------------------------------------
php cron\cleanup-unpaid.php
echo.

echo [2/3] Testing Payment Reminders...
echo ------------------------------------------
php cron\payment-reminders.php
echo.

echo [3/3] Testing Refund Countdown Update...
echo ------------------------------------------
php cron\update-refund-countdown.php
echo.

echo ==========================================
echo ALL TESTS COMPLETE!
echo ==========================================
echo.
echo Check the output above for any errors.
echo Logs should show:
echo   - Applications cleaned: X
echo   - Reminders sent: X
echo   - Refunds updated: X
echo.

pause
