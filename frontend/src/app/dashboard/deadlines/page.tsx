import type { Metadata } from "next";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { clientEnv } from "@/lib/env";
import type { Deadline } from "@/types";

export const metadata: Metadata = {
  title: "Application Deadlines | Tundua",
};

async function getDeadlines(): Promise<Deadline[]> {
  try {
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/api/v1/deadlines`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.deadlines ?? data?.data ?? [];
  } catch {
    return [];
  }
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function urgencyBadge(days: number) {
  if (days < 0) return { label: "Closed", color: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400" };
  if (days <= 14) return { label: `${days}d left`, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
  if (days <= 30) return { label: `${days}d left`, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return { label: `${days}d left`, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
}

const COUNTRIES = ["All", "United Kingdom", "Canada", "United States", "Australia", "Ireland"];

export default async function DeadlinesPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const params = await searchParams;
  const deadlines = await getDeadlines();

  const filtered = deadlines
    .filter((d) => d.is_active)
    .filter((d) => !params.country || params.country === "All" || d.country === params.country)
    .sort((a, b) => new Date(a.deadline_date).getTime() - new Date(b.deadline_date).getTime());

  const upcoming = filtered.filter((d) => daysUntil(d.deadline_date) >= 0);
  const closed = filtered.filter((d) => daysUntil(d.deadline_date) < 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-600" />
          Application Deadlines
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Stay on top of intake deadlines for your shortlisted universities.
        </p>
      </div>

      {/* Country filter */}
      <div className="flex flex-wrap gap-2">
        {COUNTRIES.map((c) => {
          const active = (!params.country && c === "All") || params.country === c;
          return (
            <a
              key={c}
              href={c === "All" ? "/dashboard/deadlines" : `/dashboard/deadlines?country=${encodeURIComponent(c)}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {c}
            </a>
          );
        })}
      </div>

      {upcoming.length === 0 && closed.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">No deadlines found.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Check back soon — new deadlines are added regularly.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Upcoming ({upcoming.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.map((d) => {
                  const days = daysUntil(d.deadline_date);
                  const badge = urgencyBadge(days);
                  return (
                    <div
                      key={d.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                          {d.university_name}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {d.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {d.intake} {d.intake_year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(d.deadline_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="capitalize">{d.program_type === "all" ? "UG & PG" : d.program_type}</span>
                      </div>
                      {d.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                          {d.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {closed.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Closed ({closed.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                {closed.map((d) => (
                  <div
                    key={d.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-2"
                  >
                    <h3 className="font-semibold text-gray-700 dark:text-gray-400 text-sm">{d.university_name}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{d.country}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{d.intake} {d.intake_year}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(d.deadline_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
