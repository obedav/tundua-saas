import type { Metadata } from "next";
import { TrendingUp, Users, DollarSign, Award, AlertCircle } from "lucide-react";
import { getAllApplications } from "@/lib/actions/admin/applications";

export const metadata: Metadata = {
  title: "Edvoy Commissions | Admin",
};

// Commission tiers for top Edvoy partner universities (from Schedule 3)
const COMMISSION_RATES: Record<string, { tiers: Array<{ from: number; to: number | null; rate: number }> }> = {
  "Global Banking School":          { tiers: [{ from: 1, to: 5, rate: 14 }, { from: 6, to: 15, rate: 17.5 }, { from: 16, to: null, rate: 21 }] },
  "Bangor University":              { tiers: [{ from: 1, to: 15, rate: 14 }, { from: 16, to: 25, rate: 17.5 }, { from: 26, to: null, rate: 21 }] },
  "University of East London":      { tiers: [{ from: 1, to: null, rate: 15.4 }] },
  "Sheffield Hallam University":    { tiers: [{ from: 1, to: null, rate: 14 }] },
  "London Metropolitan University": { tiers: [{ from: 1, to: null, rate: 14 }] },
  "University of Winchester":       { tiers: [{ from: 1, to: 10, rate: 14 }, { from: 11, to: null, rate: 17.5 }] },
  "University for the Creative Arts": { tiers: [{ from: 1, to: 2, rate: 10.5 }, { from: 3, to: 10, rate: 14 }, { from: 11, to: null, rate: 17.5 }] },
  "University of Roehampton":       { tiers: [{ from: 1, to: 4, rate: 10.5 }, { from: 5, to: 9, rate: 12.25 }, { from: 10, to: 19, rate: 14 }, { from: 20, to: 29, rate: 15.75 }, { from: 30, to: null, rate: 17.5 }] },
  "London South Bank University":   { tiers: [{ from: 1, to: 4, rate: 10.5 }, { from: 5, to: 14, rate: 12.25 }, { from: 15, to: 29, rate: 14 }, { from: 30, to: null, rate: 17.5 }] },
  "University of Stirling":         { tiers: [{ from: 1, to: 14, rate: 10.5 }, { from: 15, to: 29, rate: 14 }, { from: 30, to: null, rate: 17.5 }] },
};
const DEFAULT_RATE = 10.5;
// Average UK tuition in GBP — used for commission estimates
const AVG_TUITION_GBP = 14000;
const GBP_TO_NGN = 2050;

function getRate(universityName: string, count: number): number {
  const key = Object.keys(COMMISSION_RATES).find((k) =>
    universityName.toLowerCase().includes(k.toLowerCase())
  );
  if (!key) return DEFAULT_RATE;
  const tiers = COMMISSION_RATES[key]!.tiers;
  for (const tier of [...tiers].reverse()) {
    if (count >= tier.from) return tier.rate;
  }
  return tiers[0]!.rate;
}

function nextTier(universityName: string, count: number): { needed: number; nextRate: number } | null {
  const key = Object.keys(COMMISSION_RATES).find((k) =>
    universityName.toLowerCase().includes(k.toLowerCase())
  );
  if (!key) return null;
  const tiers = COMMISSION_RATES[key]!.tiers;
  for (const tier of tiers) {
    if (tier.to !== null && count < tier.to + 1) {
      const next = tiers[tiers.indexOf(tier) + 1];
      if (next) return { needed: tier.to + 1 - count, nextRate: next.rate };
    }
  }
  return null;
}

export default async function EdvoyCommissionsPage() {
  let allApplications: any[] = [];
  try {
    const data = await getAllApplications({ per_page: 500 });
    allApplications = data?.applications ?? data?.data?.applications ?? [];
  } catch {
    allApplications = [];
  }

  // Only applications that have progressed to offer or beyond
  const pipeline = allApplications.filter((a) =>
    ["offer_received", "completed"].includes(a.status)
  );

  // Group by university for volume milestone tracking
  const universityMap: Record<string, { count: number; completed: number }> = {};
  for (const app of pipeline) {
    const unis: string[] = Array.isArray(app.universities) ? app.universities : [];
    for (const uni of unis) {
      if (!universityMap[uni]) universityMap[uni] = { count: 0, completed: 0 };
      universityMap[uni].count++;
      if (app.status === "completed") universityMap[uni].completed++;
    }
  }

  // Summary stats
  const totalOffers = pipeline.filter((a) => a.status === "offer_received").length;
  const totalEnrolled = pipeline.filter((a) => a.status === "completed").length;
  const estimatedCommission = Object.entries(universityMap).reduce((sum, [uni, { completed }]) => {
    if (completed === 0) return sum;
    const rate = getRate(uni, completed);
    return sum + (AVG_TUITION_GBP * (rate / 100) * completed * GBP_TO_NGN);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          Edvoy Commission Tracker
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Pipeline of placed students and estimated placement commissions from the Edvoy partnership.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Offers Received</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOffers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Enrolled (Completed)</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEnrolled}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Est. Commission (₦)</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ₦{Math.round(estimatedCommission).toLocaleString("en-NG")}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Based on avg £{AVG_TUITION_GBP.toLocaleString()} tuition</p>
        </div>
      </div>

      {/* Volume milestones */}
      {Object.keys(universityMap).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Volume Milestones by University</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">More placements at a university unlock higher commission tiers.</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">University</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Placements</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Current Rate</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Next Tier</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Est. Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(universityMap)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([uni, { count, completed }]) => {
                  const rate = getRate(uni, count);
                  const next = nextTier(uni, count);
                  const est = completed > 0 ? AVG_TUITION_GBP * (rate / 100) * completed * GBP_TO_NGN : 0;
                  return (
                    <tr key={uni}>
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{uni}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                        {count} total · {completed} enrolled
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{rate}%</span>
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400 text-xs">
                        {next
                          ? <span className="text-amber-600 dark:text-amber-400">{next.needed} more → {next.nextRate}%</span>
                          : <span className="text-green-600 dark:text-green-400">Max tier ✓</span>}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                        {est > 0 ? `₦${Math.round(est).toLocaleString("en-NG")}` : "—"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Application pipeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Student Pipeline</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Applications at offer_received or completed stage.</p>
        </div>
        {pipeline.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No students at offer or enrollment stage yet.</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Commission data will appear here as applications progress.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Student</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Universities</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Stage</th>
                <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pipeline.map((app) => (
                <tr key={app.id}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{app.applicant_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.reference_number}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400 text-xs">
                    {(app.universities ?? []).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      app.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}>
                      {app.status === "completed" ? "Enrolled" : "Offer Received"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(app.updated_at).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Commission estimates are based on avg £{AVG_TUITION_GBP.toLocaleString()} UK tuition × current rate tier × ₦{GBP_TO_NGN.toLocaleString()}/GBP.
          Actual commissions depend on tuition fee paid by the student. Submit tuition receipts to Edvoy to trigger payment.
        </span>
      </div>
    </div>
  );
}
