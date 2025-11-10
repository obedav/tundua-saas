"use client";

import { useState } from "react";
import { School, Plus, Edit, Trash2, Search, Globe, X } from "lucide-react";
import { toast } from "sonner";

interface University {
  id: number;
  name: string;
  country: string;
  city: string;
  ranking: number;
  website: string;
}

export default function UniversityDirectory() {
  const [universities, setUniversities] = useState<University[]>([
    { id: 1, name: "Harvard University", country: "United States", city: "Cambridge", ranking: 1, website: "https://harvard.edu" },
    { id: 2, name: "Stanford University", country: "United States", city: "Stanford", ranking: 2, website: "https://stanford.edu" },
    { id: 3, name: "Oxford University", country: "United Kingdom", city: "Oxford", ranking: 3, website: "https://ox.ac.uk" },
    { id: 4, name: "Cambridge University", country: "United Kingdom", city: "Cambridge", ranking: 4, website: "https://cam.ac.uk" },
    { id: 5, name: "University of Toronto", country: "Canada", city: "Toronto", ranking: 18, website: "https://utoronto.ca" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    ranking: 0,
    website: "",
  });

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUniversity(null);
    setFormData({ name: "", country: "", city: "", ranking: 0, website: "" });
    setShowModal(true);
  };

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setFormData(university);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this university?")) {
      setUniversities(universities.filter(u => u.id !== id));
      toast.success("University deleted successfully");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUniversity) {
      setUniversities(
        universities.map(u =>
          u.id === editingUniversity.id ? { ...formData, id: u.id } : u
        )
      );
      toast.success("University updated successfully");
    } else {
      const newUniversity = {
        ...formData,
        id: Math.max(...universities.map(u => u.id), 0) + 1,
      };
      setUniversities([...universities, newUniversity]);
      toast.success("University added successfully");
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">University Directory</h1>
          <p className="text-gray-600 mt-1">Manage university database ({universities.length} universities)</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add University
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search universities by name, country, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUniversities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <School className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <p>No universities found</p>
                  </td>
                </tr>
              ) : (
                filteredUniversities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">#{uni.ranking}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <School className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{uni.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">{uni.city}, {uni.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Visit Site
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(uni)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(uni.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUniversity ? "Edit University" : "Add University"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
                <input
                  type="number"
                  required
                  value={formData.ranking}
                  onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingUniversity ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
