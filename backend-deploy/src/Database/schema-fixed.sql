-- Tundua Study Abroad SaaS Platform - Database Schema (FIXED)
-- Version: 1.1
-- Date: 2025-01-06
-- Fix: Removed circular foreign key dependency

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Create database
CREATE DATABASE IF NOT EXISTS tundua_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tundua_saas;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS addon_orders;
DROP TABLE IF EXISTS refunds;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS addon_services;
DROP TABLE IF EXISTS service_tiers;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
