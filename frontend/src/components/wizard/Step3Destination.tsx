"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Globe, Building2, GraduationCap, BookOpen, Calendar, Loader2 } from "lucide-react";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  destination_country: z.string().min(1, "Destination country is required"),
  universities: z.array(z.string()).min(1, "Select at least one university"),
  program_type: z.string().min(1, "Program type is required"),
  intended_major: z.string().min(2, "Intended major is required"),
  intake_season: z.string().min(1, "Intake season is required"),
  intake_year: z.coerce.number().min(2024).max(2030),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Country {
  country: string;
  count: number;
}

interface University {
  id: number;
  name: string;
  country: string;
  city: string;
  tuition_range: {
    min: string;
    max: string;
    currency: string;
  };
  acceptance_rate: string;
  recommended_platform: string;
  expected_commission: string;
  match_score?: number;
}

export default function Step3Destination({ data, updateData, onNext }: Props) {
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(
    data.universities || []
  );
  const [customUniversity, setCustomUniversity] = useState("");

  // API State
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
      universities: data.universities || [],
    },
  });

  const selectedCountry = watch("destination_country");

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load universities when country changes
  useEffect(() => {
    if (selectedCountry) {
      loadUniversities(selectedCountry);
    }
  }, [selectedCountry]);

  const loadCountries = async () => {
    setLoadingCountries(true);
    setError(null);
    try {
      const response = await apiClient.getCountries();
      if (response.data.success) {
        setCountries(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load countries:', err);
      setError('Failed to load countries. Please refresh the page.');
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadUniversities = async (country: string) => {
    setLoadingUniversities(true);
    setError(null);
    try {
      const response = await apiClient.searchUniversities({
        country,
        sort: 'smart',
        per_page: 100
      });

      console.log('Universities API response:', response.data);

      if (response.data.success) {
        // Ensure we have an array of universities
        const universitiesData = Array.isArray(response.data.data) ? response.data.data : [];
        console.log('Universities loaded from API:', universitiesData.length);

        // Count duplicates for debugging
        const uniqueNames = new Set(universitiesData.map((u: University) => u.name));
        console.log('Unique university names:', uniqueNames.size);
        console.log('Duplicates filtered:', universitiesData.length - uniqueNames.size);

        setUniversities(universitiesData);
      } else {
        console.error('API returned success=false:', response.data);
        setError(response.data.error || 'Failed to load universities');
        setUniversities([]);
      }
    } catch (err: any) {
      console.error('Failed to load universities:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to load universities for this country.');
      setUniversities([]);
    } finally {
      setLoadingUniversities(false);
    }
  };

  // Remove duplicates by name and keep full university objects for unique IDs
  const availableUniversities = universities
    .filter(uni => uni && uni.name) // Filter out null/undefined or universities without names
    .reduce((acc, uni) => {
      // Only add if name doesn't already exist in accumulator
      if (!acc.find(u => u.name === uni.name)) {
        acc.push(uni);
      }
      return acc;
    }, [] as University[]);

  const addUniversity = (university: string) => {
    if (!selectedUniversities.includes(university) && selectedUniversities.length < 8) {
      const updated = [...selectedUniversities, university];
      setSelectedUniversities(updated);
      setValue("universities", updated);
    }
  };

  const removeUniversity = (university: string) => {
    const updated = selectedUniversities.filter((u) => u !== university);
    setSelectedUniversities(updated);
    setValue("universities", updated);
  };

  const addCustomUniversity = () => {
    if (customUniversity.trim() && !selectedUniversities.includes(customUniversity)) {
      addUniversity(customUniversity.trim());
      setCustomUniversity("");
    }
  };

  const onSubmit = (formData: FormData) => {
    updateData(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Destination Country Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <Globe className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Study Destination</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span>Select your destination country and target universities to begin your study abroad journey.</span>
          </p>
        </div>

        {/* Destination Country */}
        <div className="group">
          <label htmlFor="destination_country" className="block text-sm font-medium text-gray-700 mb-2">
            Destination Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <select
              {...register("destination_country")}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400 bg-white disabled:opacity-50"
              disabled={loadingCountries}
            >
              <option value="">
                {loadingCountries ? 'Loading countries...' : 'Select country'}
              </option>
              {countries.map((countryData) => (
                <option key={countryData.country} value={countryData.country}>
                  {countryData.country} ({countryData.count} universities)
                </option>
              ))}
            </select>
            {loadingCountries && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Loader2 className="h-5 w-5 text-primary-500 animate-spin" />
              </div>
            )}
          </div>
          {errors.destination_country && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.destination_country.message}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800 flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {error}
            </p>
          </div>
        )}

        {/* Universities Selection */}
        {selectedCountry && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Select Universities <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedUniversities.length} / 8 selected
              </span>
            </div>

            {/* Selected Universities */}
            {selectedUniversities.length > 0 && (
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <p className="text-xs font-medium text-primary-800 mb-3 flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  Your Selected Universities
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUniversities.map((uni) => (
                    <div
                      key={uni}
                      className="inline-flex items-center gap-2 bg-white text-primary-700 px-3 py-2 rounded-lg text-sm font-medium border border-primary-200 shadow-sm"
                    >
                      {uni}
                      <button
                        type="button"
                        onClick={() => removeUniversity(uni)}
                        className="text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Universities */}
            {selectedUniversities.length < 8 && (
              <>
                <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white">
                  <p className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    {loadingUniversities ? 'Loading universities...' : `Popular universities in ${selectedCountry}:`}
                  </p>
                  {loadingUniversities ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                    </div>
                  ) : universities.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p>No universities found for this country.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {availableUniversities.map((uni) => (
                        <button
                          key={uni.id}
                          type="button"
                          onClick={() => addUniversity(uni.name)}
                          disabled={selectedUniversities.includes(uni.name)}
                          className="group w-full text-left px-4 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all duration-200 flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-700 group-hover:text-primary-700">
                            {uni.name}
                          </span>
                          {!selectedUniversities.includes(uni.name) && (
                            <Plus className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom University */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Can&apos;t find your university? Add a custom one
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={customUniversity}
                        onChange={(e) => setCustomUniversity(e.target.value)}
                        placeholder="Enter university name"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomUniversity();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCustomUniversity}
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {errors.universities && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.universities.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Program Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <GraduationCap className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Program Details</h3>
        </div>

        {/* Program Type */}
        <div className="group">
          <label htmlFor="program_type" className="block text-sm font-medium text-gray-700 mb-2">
            Program Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <select
              {...register("program_type")}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400 bg-white"
            >
              <option value="">Select program type</option>
              <option value="undergraduate">Undergraduate (Bachelor&apos;s)</option>
              <option value="graduate">Graduate (Master&apos;s)</option>
              <option value="phd">Doctorate (PhD)</option>
              <option value="certificate">Certificate/Diploma</option>
            </select>
          </div>
          {errors.program_type && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.program_type.message}
            </p>
          )}
        </div>

        {/* Intended Major */}
        <div className="group">
          <label htmlFor="intended_major" className="block text-sm font-medium text-gray-700 mb-2">
            Intended Major/Field of Study <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              {...register("intended_major")}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
              placeholder="e.g., Computer Science, MBA, Data Science"
            />
          </div>
          {errors.intended_major && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">⚠</span> {errors.intended_major.message}
            </p>
          )}
        </div>

        {/* Intake Season and Year */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="group">
            <label htmlFor="intake_season" className="block text-sm font-medium text-gray-700 mb-2">
              Intake Season <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <select
                {...register("intake_season")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400 bg-white"
              >
                <option value="">Select intake</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2026">Fall 2026</option>
              </select>
            </div>
            {errors.intake_season && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.intake_season.message}
              </p>
            )}
          </div>

          <div className="group">
            <label htmlFor="intake_year" className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="number"
                {...register("intake_year")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder="2025"
                min="2024"
                max="2030"
              />
            </div>
            {errors.intake_year && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.intake_year.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="hidden" id="step3-submit-btn">
        Next
      </button>
    </form>
  );
}
