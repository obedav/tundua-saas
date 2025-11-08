"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { GraduationCap, BookOpen, Building2, Calendar, Award, Languages } from "lucide-react";

const schema = z.object({
  highest_education: z.string().min(1, "Education level is required"),
  field_of_study: z.string().min(2, "Field of study is required"),
  institution_name: z.string().min(2, "Institution name is required"),
  graduation_year: z.coerce.number().min(1990).max(2030),
  gpa: z.coerce.number().min(0).max(4.0),
  english_test_type: z.string().optional(),
  english_test_score: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Academic({ data, updateData, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const onSubmit = (formData: FormData) => {
    updateData(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Education Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <GraduationCap className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Education Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Highest Education */}
          <div className="group sm:col-span-2">
            <label htmlFor="highest_education" className="block text-sm font-medium text-gray-700 mb-2">
              Highest Level of Education <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <select
                {...register("highest_education")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400 bg-white"
              >
                <option value="">Select education level</option>
                <option value="High School">High School</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate (PhD)">Doctorate (PhD)</option>
              </select>
            </div>
            {errors.highest_education && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.highest_education.message}
              </p>
            )}
          </div>

          {/* Field of Study */}
          <div className="group sm:col-span-2">
            <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 mb-2">
              Field of Study <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                {...register("field_of_study")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder="e.g., Computer Science, Business Administration"
              />
            </div>
            {errors.field_of_study && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.field_of_study.message}
              </p>
            )}
          </div>

          {/* Institution Name */}
          <div className="group sm:col-span-2">
            <label htmlFor="institution_name" className="block text-sm font-medium text-gray-700 mb-2">
              Institution Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                {...register("institution_name")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder="e.g., University of California"
              />
            </div>
            {errors.institution_name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.institution_name.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Academic Performance Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <Award className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Graduation Year */}
          <div className="group">
            <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700 mb-2">
              Graduation Year <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="number"
                {...register("graduation_year")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder="2024"
                min="1990"
                max="2030"
              />
            </div>
            {errors.graduation_year && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.graduation_year.message}
              </p>
            )}
          </div>

          {/* GPA */}
          <div className="group">
            <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-2">
              GPA (4.0 scale) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Award className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="number"
                step="0.01"
                {...register("gpa")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder="3.5"
                min="0"
                max="4.0"
              />
            </div>
            {errors.gpa && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.gpa.message}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* English Proficiency Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-100">
          <Languages className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">English Proficiency Test</h3>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            Optional but recommended for international students
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* English Test Type */}
          <div className="group">
            <label htmlFor="english_test_type" className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Languages className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <select
                {...register("english_test_type")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400 bg-white"
              >
                <option value="">Select test</option>
                <option value="TOEFL">TOEFL</option>
                <option value="IELTS">IELTS</option>
                <option value="Duolingo">Duolingo English Test</option>
                <option value="PTE">PTE Academic</option>
                <option value="None">Not taken yet</option>
              </select>
            </div>
          </div>

          {/* English Test Score */}
          <div className="group">
            <label htmlFor="english_test_score" className="block text-sm font-medium text-gray-700 mb-2">
              Score
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Award className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                {...register("english_test_score")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder="e.g., 100, 7.5"
              />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="hidden" id="step2-submit-btn">
        Next
      </button>
    </form>
  );
}
