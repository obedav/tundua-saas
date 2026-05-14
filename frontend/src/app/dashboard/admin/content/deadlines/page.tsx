"use client";

import { useState } from "react";
import { Calendar, Plus, Edit, Trash2, X, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Deadline {
  id: number;
  university_name: string;
  country: string;
  intake: string;
  intake_year: number;
  deadline_date: string;
  program_type: "undergraduate" | "postgraduate" | "all";
  notes: string;
  is_active: boolean;
}

const BLANK: Omit<Deadline, "id" | "is_active"> = {
  university_name: "",
  country: "United Kingdom",
  intake: "September",
  intake_year: new Date().getFullYear() + 1,
  deadline_date: "",
  program_type: "all",
  notes: "",
};

const COUNTRIES = ["United Kingdom", "Canada", "United States", "Australia", "Ireland", "Germany", "Netherlands", "Other"];
const INTAKES = ["January", "May", "September", "October"];
const PROGRAM_TYPES = [
  { value: "all", label: "UG & PG" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
];

export default function AdminDeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    { id: 1, university_name: "University of Wolverhampton", country: "United Kingdom", intake: "September", intake_year: 2026, deadline_date: "2026-07-31", program_type: "all", notes: "Apply early — popular with Nigerian students", is_active: true },
    { id: 2, university_name: "London Metropolitan University", country: "United Kingdom", intake: "September", intake_year: 2026, deadline_date: "2026-08-15", program_type: "all", notes: "", is_active: true },
    { id: 3, university_name: "Sheffield Hallam University", country: "United Kingdom", intake: "September", intake_year: 2026, deadline_date: "2026-07-15", program_type: "postgraduate", notes: "", is_active: true },
    { id: 4, university_name: "University of East London", country: "United Kingdom", intake: "September", intake_year: 2026, deadline_date: "2026-08-01", program_type: "undergraduate", notes: "Affordable London option", is_active: true },
    { id: 5, university_name: "Georgian College", country: "Canada", intake: "January", intake_year: 2027, deadline_date: "2026-11-01", program_type: "all", notes: "", is_active: true },
    { id: 6, university_name: "Conestoga College", country: "Canada", intake: "January", intake_year: 2027, deadline_date: "2026-10-15", program_type: "all", notes: "", is_active: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deadline | null>(null);
  const [form, setForm] = useState<Omit<Deadline, "id" | "is_active">>(BLANK);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditing(null); setForm(BLANK); setShowModal(true); };
  const openEdit = (d: Deadline) => { setEditing(d); setForm({ ...d }); setShowModal(true); };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this deadline?")) return;
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
    toast.success("Deadline deleted");
  };

  const toggleActive = (id: number) => {
    setDeadlines((prev) => prev.map((d) => d.id === id ? { ...d, is_active: !d.is_active } : d));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        setDeadlines((prev) => prev.map((d) => d.id === editing.id ? { ...form, id: d.id, is_active: d.is_active } : d));
        toast.success("Deadline updated");
      } else {
        const newDeadline: Deadline = {
          ...form,
          id: Math.max(0, ...deadlines.map((d) => d.id)) + 1,
          is_active: true,
        };
        setDeadlines((prev) => [...prev, newDeadline]);
        toast.success("Deadline added");
      }
      setSaving(false);
      setShowModal(false);
    }, 400);
  };

  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.deadline_date).getTime() - new Date(b.deadline_date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary-600" />
            Application Deadlines
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Manage university intake deadlines shown to students.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deadline
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">University</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Country</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Intake</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Deadline</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Type</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sorted.map((d) => {
              const isPast = new Date(d.deadline_date) < new Date();
              return (
                <tr key={d.id} className={!d.is_active ? "opacity-50" : ""}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{d.university_name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.country}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{d.intake} {d.intake_year}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${isPast ? "text-gray-400" : "text-gray-900 dark:text-white"}`}>
                      {new Date(d.deadline_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {isPast && <span className="ml-2 text-xs text-gray-400">(closed)</span>}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">
                    {d.program_type === "all" ? "UG & PG" : d.program_type}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(d.id)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        d.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {d.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(d)} className="text-gray-500 hover:text-primary-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Deadlines marked as <strong>Hidden</strong> are not shown to students. Toggle to show/hide without deleting.</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editing ? "Edit Deadline" : "Add Deadline"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University Name</label>
                <input
                  required
                  value={form.university_name}
                  onChange={(e) => setForm((f) => ({ ...f, university_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Type</label>
                  <select
                    value={form.program_type}
                    onChange={(e) => setForm((f) => ({ ...f, program_type: e.target.value as Deadline["program_type"] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    {PROGRAM_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intake</label>
                  <select
                    value={form.intake}
                    onChange={(e) => setForm((f) => ({ ...f, intake: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    {INTAKES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                  <input
                    type="number"
                    min={2025}
                    max={2030}
                    value={form.intake_year}
                    onChange={(e) => setForm((f) => ({ ...f, intake_year: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline Date</label>
                <input
                  required
                  type="date"
                  value={form.deadline_date}
                  onChange={(e) => setForm((f) => ({ ...f, deadline_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="e.g. Apply early — popular intake"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
