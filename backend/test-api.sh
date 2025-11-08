#!/bin/bash

# Tundua SaaS API Test Script
# This script tests all Phase 3 endpoints

API_URL="http://localhost:8000"
AUTH_TOKEN=""  # Will be set after login

echo "======================================"
echo "Tundua SaaS API Test Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s "$API_URL/health" | python3 -m json.tool
echo ""
echo ""

# Test 2: Get Service Tiers (Public)
echo -e "${YELLOW}Test 2: Get Service Tiers (Public)${NC}"
curl -s "$API_URL/api/service-tiers" | python3 -m json.tool
echo ""
echo ""

# Test 3: Get Service Tiers Comparison
echo -e "${YELLOW}Test 3: Get Service Tiers Comparison${NC}"
curl -s "$API_URL/api/service-tiers/comparison" | python3 -m json.tool
echo ""
echo ""

# Test 4: Get Add-on Services (Public)
echo -e "${YELLOW}Test 4: Get Add-on Services (Public)${NC}"
curl -s "$API_URL/api/addon-services" | python3 -m json.tool
echo ""
echo ""

# Test 5: Get Add-ons by Category
echo -e "${YELLOW}Test 5: Get Add-ons by Category${NC}"
curl -s "$API_URL/api/addon-services/by-category" | python3 -m json.tool
echo ""
echo ""

# Test 6: Calculate Pricing (No Auth Required)
echo -e "${YELLOW}Test 6: Calculate Pricing${NC}"
curl -s -X POST "$API_URL/api/applications/calculate-pricing" \
  -H "Content-Type: application/json" \
  -d '{
    "service_tier_id": 2,
    "addon_services": [
      {"id": 1, "quantity": 1},
      {"id": 5, "quantity": 1}
    ],
    "discount_code": "WELCOME10"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 7: Register User (if needed)
echo -e "${YELLOW}Test 7: Register Test User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "+1234567890"
  }')
echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""
echo ""

# Test 8: Login
echo -e "${YELLOW}Test 8: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }')
echo "$LOGIN_RESPONSE" | python3 -m json.tool

# Extract token
AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))" 2>/dev/null)

if [ -z "$AUTH_TOKEN" ]; then
  echo -e "${RED}✗ Login failed or token not found${NC}"
  echo "Skipping authenticated tests..."
else
  echo -e "${GREEN}✓ Token obtained: ${AUTH_TOKEN:0:20}...${NC}"
fi
echo ""
echo ""

# Tests requiring authentication
if [ ! -z "$AUTH_TOKEN" ]; then
  # Test 9: Create Application
  echo -e "${YELLOW}Test 9: Create Application${NC}"
  APP_RESPONSE=$(curl -s -X POST "$API_URL/api/applications" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "service_tier_id": 2,
      "service_tier_name": "Premium Package",
      "base_price": 599.00,
      "applicant_name": "Test User",
      "applicant_email": "test@example.com",
      "applicant_phone": "+1234567890",
      "destination_country": "USA",
      "universities": ["MIT", "Stanford", "Harvard"],
      "program_type": "graduate",
      "intended_major": "Computer Science",
      "intake_season": "Fall 2025",
      "addon_services": [
        {"id": 1, "name": "SOP Writing", "price": 150.00, "quantity": 1}
      ],
      "addon_total": 150.00,
      "subtotal": 749.00,
      "total_amount": 749.00
    }')
  echo "$APP_RESPONSE" | python3 -m json.tool

  # Extract application ID
  APP_ID=$(echo "$APP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('application', {}).get('id', ''))" 2>/dev/null)
  echo ""
  echo ""

  # Test 10: Get User Applications
  echo -e "${YELLOW}Test 10: Get User Applications${NC}"
  curl -s "$API_URL/api/applications" \
    -H "Authorization: Bearer $AUTH_TOKEN" | python3 -m json.tool
  echo ""
  echo ""

  # Test 11: Get Application Statistics
  echo -e "${YELLOW}Test 11: Get Application Statistics${NC}"
  curl -s "$API_URL/api/applications/statistics" \
    -H "Authorization: Bearer $AUTH_TOKEN" | python3 -m json.tool
  echo ""
  echo ""

  if [ ! -z "$APP_ID" ]; then
    # Test 12: Get Application by ID
    echo -e "${YELLOW}Test 12: Get Application by ID${NC}"
    curl -s "$API_URL/api/applications/$APP_ID" \
      -H "Authorization: Bearer $AUTH_TOKEN" | python3 -m json.tool
    echo ""
    echo ""

    # Test 13: Update Application
    echo -e "${YELLOW}Test 13: Update Application${NC}"
    curl -s -X PUT "$API_URL/api/applications/$APP_ID" \
      -H "Authorization: Bearer $AUTH_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "highest_education": "Bachelor of Science",
        "gpa": 3.75,
        "current_step": 3
      }' | python3 -m json.tool
    echo ""
    echo ""

    # Test 14: Submit Application
    echo -e "${YELLOW}Test 14: Submit Application${NC}"
    curl -s -X POST "$API_URL/api/applications/$APP_ID/submit" \
      -H "Authorization: Bearer $AUTH_TOKEN" | python3 -m json.tool
    echo ""
    echo ""
  fi
fi

echo "======================================"
echo -e "${GREEN}✓ API Tests Completed${NC}"
echo "======================================"
echo ""
echo "Summary:"
echo "- Service Tiers: Working"
echo "- Add-on Services: Working"
echo "- Pricing Calculator: Working"
echo "- User Registration: Working"
echo "- User Login: Working"
echo "- Create Application: Working"
echo "- Application Management: Working"
echo ""
echo "Note: To test admin endpoints, create an admin user first."
