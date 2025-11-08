"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Save } from "lucide-react";
import { toast } from "sonner";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function PasswordChange() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const requirements: PasswordRequirement[] = [
    { label: "At least 8 characters long", met: passwords.new.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(passwords.new) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(passwords.new) },
    { label: "Contains a number", met: /\d/.test(passwords.new) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new) },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);
  const passwordsMatch = passwords.new === passwords.confirm && passwords.confirm !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      toast.error("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (!passwords.current) {
      toast.error("Please enter your current password");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    toggleShow,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    toggleShow: () => void;
    placeholder: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Ensure your account is using a strong password to stay secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Current Password */}
          <PasswordInput
            label="Current Password"
            value={passwords.current}
            onChange={(value) => setPasswords({ ...passwords, current: value })}
            show={showCurrentPassword}
            toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
            placeholder="Enter your current password"
          />

          {/* New Password */}
          <PasswordInput
            label="New Password"
            value={passwords.new}
            onChange={(value) => setPasswords({ ...passwords, new: value })}
            show={showNewPassword}
            toggleShow={() => setShowNewPassword(!showNewPassword)}
            placeholder="Enter your new password"
          />

          {/* Password Requirements */}
          {passwords.new && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Password Requirements</h4>
              <div className="space-y-2">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {requirement.met ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        requirement.met ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {requirement.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm New Password"
            value={passwords.confirm}
            onChange={(value) => setPasswords({ ...passwords, confirm: value })}
            show={showConfirmPassword}
            toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="Confirm your new password"
          />

          {/* Password Match Indicator */}
          {passwords.confirm && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                passwordsMatch
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Passwords match</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Passwords do not match</span>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving || !allRequirementsMet || !passwordsMatch || !passwords.current}
              className="w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Never share your password with anyone</li>
            <li>• Use a unique password for this account</li>
            <li>• Change your password regularly</li>
            <li>• Enable two-factor authentication for extra security</li>
          </ul>
        </div>

        {/* Last Changed */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          Last changed: January 15, 2025
        </div>
      </form>
    </div>
  );
}
