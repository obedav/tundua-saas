"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Copy, Mail, DollarSign, Users, TrendingUp, Gift, Facebook, Twitter, Linkedin } from "lucide-react";

interface ReferralStats {
  total_referrals: number;
  pending: number;
  signed_up: number;
  converted: number;
  total_rewards_earned: number;
  total_rewards_claimed: number;
  total_rewards_pending: number;
  conversion_rate: number;
}

interface Referral {
  id: number;
  referred_email: string;
  status: string;
  reward_amount: number;
  reward_claimed: boolean;
  created_at: string;
  signed_up_at?: string;
  converted_at?: string;
}

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await apiClient.getUserReferrals();
      setReferralCode(response.data.referral_code);
      setReferralLink(response.data.referral_link);
      setStats(response.data.stats);
      setReferrals(response.data.referrals);
    } catch (error: any) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const shareViaEmail = () => {
    const subject = "Join Tundua - Study Abroad Made Easy";
    const body = `I'm using Tundua for my study abroad application and thought you might be interested!\n\nUse my referral link to get ₦10,000 off your first application:\n${referralLink}\n\nTundua makes the entire process super easy with expert support at every step.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaSocial = (platform: string) => {
    const text = `Join me on Tundua for hassle-free study abroad applications! Get ₦10,000 off using my referral link:`;
    const url = referralLink;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const inviteFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      await apiClient.createReferral(email, 'email');
      toast.success("Invitation sent successfully!");
      setEmail("");
      fetchReferrals();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const claimReward = async (referralId: number) => {
    try {
      await apiClient.claimReferralReward(referralId);
      toast.success("Reward claimed successfully!");
      fetchReferrals();
    } catch (error: any) {
      toast.error("Failed to claim reward");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: "bg-gray-100 text-gray-700", text: "Pending" },
      signed_up: { color: "bg-blue-100 text-blue-700", text: "Signed Up" },
      converted: { color: "bg-green-100 text-green-700", text: "Converted" },
      rewarded: { color: "bg-purple-100 text-purple-700", text: "Rewarded" },
    };
    const badge = badges[status as keyof typeof badges] || badges['pending'];
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge?.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Refer & Earn</h1>
        <p className="text-gray-600 mt-2">
          Share Tundua with friends and earn ₦10,000 for every successful referral!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6" />
            <p className="text-sm font-medium opacity-90">Total Referrals</p>
          </div>
          <p className="text-3xl font-bold">{stats?.total_referrals || 0}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.conversion_rate || 0}%</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-6 w-6 text-primary-600" />
            <p className="text-sm font-medium text-gray-600">Total Earned</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦{stats?.total_rewards_earned.toLocaleString('en-NG') || "0"}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-6 w-6 text-purple-600" />
            <p className="text-sm font-medium text-gray-600">Pending Rewards</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦{stats?.total_rewards_pending.toLocaleString('en-NG') || "0"}</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referral Link</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white"
            />
            <button
              onClick={() => copyToClipboard(referralLink, "Link")}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <Copy className="h-5 w-5" />
              Copy Link
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareViaEmail}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => shareViaSocial("facebook")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </button>
            <button
              onClick={() => shareViaSocial("twitter")}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors inline-flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </button>
            <button
              onClick={() => shareViaSocial("linkedin")}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* Invite by Email */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Invite a Friend</h2>
        <form onSubmit={inviteFriend} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={inviting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {inviting ? "Sending..." : "Send Invite"}
          </button>
        </form>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Your Referrals</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No referrals yet. Start sharing your link to earn rewards!
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{referral.referred_email}</td>
                    <td className="px-6 py-4">{getStatusBadge(referral.status)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₦{referral.reward_amount.toLocaleString('en-NG')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {referral.status === "converted" && !referral.reward_claimed && (
                        <button
                          onClick={() => claimReward(referral.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Claim Reward
                        </button>
                      )}
                      {referral.reward_claimed && (
                        <span className="text-sm text-green-600 font-medium">✓ Claimed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
