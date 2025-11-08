"use client";

import { User, Mail, Phone, Calendar } from "lucide-react";

interface UserDetailsProps {
  userId: number;
}

export default function UserDetails({ userId }: UserDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Details</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">User Name</h3>
            <p className="text-sm text-gray-600">ID: {userId}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">user@example.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">+1234567890</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">Joined: Jan 1, 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
