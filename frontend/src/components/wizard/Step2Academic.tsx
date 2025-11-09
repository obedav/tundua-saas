"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { GraduationCap, BookOpen, Building2, Calendar, Award, Languages, FileText, Info, CheckCircle } from "lucide-react";

// Dynamic schema that adapts to education level
const createSchema = (educationLevel: string) => {
  const isHighSchool = educationLevel === "High School";

  return z.object({
    highest_education: z.string().min(1, "Education level is required"),
    field_of_study: isHighSchool
      ? z.string().optional()
      : z.string().min(2, "Field of study is required"),
    institution_name: z.string().min(2, "Institution name is required"),
    institution_start_date: z.string().min(1, "Start date is required"),
    institution_end_date: z.string().min(1, "End date is required"),
    graduation_year: z.coerce.number().min(1990).max(2030),
    gpa: isHighSchool
      ? z.coerce.number().min(0).max(4.0).optional().or(z.literal("").transform(() => undefined))
      : z.coerce.number().min(0).max(4.0),
    english_test_type: z.string().optional(),
    english_test_score: z.string().optional(),
  }).refine((data) => {
    // Validate that end date is after start date
    if (data.institution_start_date && data.institution_end_date) {
      return new Date(data.institution_end_date) >= new Date(data.institution_start_date);
    }
    return true;
  }, {
    message: "End date must be after start date",
    path: ["institution_end_date"],
  });
};

type FormData = {
  highest_education: string;
  field_of_study?: string;
  institution_name: string;
  institution_start_date: string;
  institution_end_date: string;
  graduation_year: number;
  gpa?: number;
  english_test_type?: string;
  english_test_score?: string;
};

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Document requirements by education level
const getDocumentRequirements = (educationLevel: string) => {
  const requirements: Record<string, { required: string[]; optional: string[]; notes: string }> = {
    "High School": {
      required: [
        "High school diploma or equivalent certificate",
        "Official transcripts (last 2-3 years)",
        "Standardized test scores (SAT/ACT if applicable)",
        "Letter of recommendation from teacher/counselor",
      ],
      optional: [
        "Extracurricular activities record",
        "Personal statement or essay",
        "Portfolio (for art/design programs)",
      ],
      notes: "For undergraduate/bachelor's degree admission"
    },
    "Associate Degree": {
      required: [
        "Associate degree certificate",
        "Official college transcripts (all semesters)",
        "Course syllabi for transfer credit evaluation",
        "Letter of recommendation from professor",
      ],
      optional: [
        "Work experience certificates",
        "Research papers or academic projects",
        "Professional certifications",
      ],
      notes: "For bachelor's degree or advanced undergraduate programs"
    },
    "Bachelor's Degree": {
      required: [
        "Bachelor's degree certificate (official copy)",
        "Complete transcripts (all 4 years or equivalent)",
        "Two academic letters of recommendation",
        "Statement of purpose (500-1000 words)",
        "Updated resume/CV",
      ],
      optional: [
        "Research publications or papers",
        "Work experience letters",
        "Professional certifications or licenses",
        "Portfolio or work samples (if relevant)",
      ],
      notes: "For master's or graduate-level programs"
    },
    "Master's Degree": {
      required: [
        "Master's degree certificate",
        "Official transcripts (bachelor's + master's)",
        "Three letters of recommendation (academic/professional)",
        "Research proposal or comprehensive statement of purpose",
        "Detailed academic CV/Resume",
        "Master's thesis or capstone project abstract",
      ],
      optional: [
        "Published research papers or articles",
        "Conference presentations list",
        "Professional work experience documents",
        "Research funding or grants received",
      ],
      notes: "For doctoral (PhD) or advanced research programs"
    },
    "Doctorate (PhD)": {
      required: [
        "PhD/Doctorate certificate",
        "Complete academic transcripts (all degrees)",
        "Comprehensive list of publications",
        "Detailed research experience documentation",
        "Three professional/academic references",
        "PhD dissertation abstract or full document",
      ],
      optional: [
        "Post-doctoral experience certificates",
        "Teaching experience documentation",
        "Research grants and funding history",
        "Patents or intellectual property records",
      ],
      notes: "For post-doctoral positions, research fellowships, or advanced academic programs"
    },
  };

  return requirements[educationLevel] || { required: [], optional: [], notes: "" };
};

export default function Step2Academic({ data, updateData, onNext }: Props) {
  const [isCurrentlyStudying, setIsCurrentlyStudying] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: async (values, context, options) => {
      // Create schema dynamically based on current highest_education value
      const currentEducation = values.highest_education || "";
      const schema = createSchema(currentEducation);
      return zodResolver(schema)(values, context, options);
    },
    defaultValues: {
      ...data,
      institution_start_date: data.institution_start_date || "",
      institution_end_date: data.institution_end_date || "",
    },
  });

  const watchedEducation = watch("highest_education");
  const isHighSchool = watchedEducation === "High School";
  const documentReqs = getDocumentRequirements(watchedEducation);

  // Clear field_of_study and gpa errors when switching to High School
  React.useEffect(() => {
    if (isHighSchool) {
      if (errors.field_of_study) {
        clearErrors("field_of_study");
      }
      if (errors.gpa) {
        clearErrors("gpa");
      }
    }
  }, [isHighSchool, errors.field_of_study, errors.gpa, clearErrors]);

  // Handle "Currently Studying" toggle
  const handleCurrentlyStudyingChange = (checked: boolean) => {
    setIsCurrentlyStudying(checked);
    if (checked) {
      // Set end date to "Present" or a future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      const formattedDate = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
      setValue("institution_end_date", formattedDate);
    }
  };

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

          {/* High School Info - Field of Study and GPA Optional */}
          {isHighSchool && (
            <div className="sm:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>High School Students:</strong> Field of Study and GPA are optional. Many high schools don't use a 4.0 scale or specific majors. You can leave these blank or fill them if available.
                </span>
              </p>
            </div>
          )}

          {/* Field of Study - Conditional for non-High School */}
          <div className="group sm:col-span-2">
            <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 mb-2">
              Field of Study {!isHighSchool && <span className="text-red-500">*</span>}
              {isHighSchool && <span className="text-gray-500 text-xs ml-1">(Optional)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                {...register("field_of_study")}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm hover:border-gray-400"
                placeholder={isHighSchool ? "e.g., General Studies (optional)" : "e.g., Computer Science, Business Administration"}
              />
            </div>
            {errors.field_of_study && !isHighSchool && (
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
                placeholder={isHighSchool ? "e.g., Lincoln High School" : "e.g., University of California"}
              />
            </div>
            {errors.institution_name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span> {errors.institution_name.message}
              </p>
            )}
          </div>

          {/* Institution Dates - Modern Design */}
          <div className="sm:col-span-2 space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Calendar className="h-4 w-4 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Duration at Institution</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="group space-y-2">
                <label htmlFor="institution_start_date" className="block text-sm font-semibold text-gray-900">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="month"
                    {...register("institution_start_date")}
                    min="1980-01"
                    max="2035-12"
                    className="block w-full pl-10 pr-4 py-3.5 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm hover:border-primary-300 bg-white font-medium"
                    placeholder="Select month and year"
                  />
                </div>
                {errors.institution_start_date && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span> {errors.institution_start_date.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  When you began your studies
                </p>
              </div>

              {/* End Date */}
              <div className="group space-y-2">
                <label htmlFor="institution_end_date" className="block text-sm font-semibold text-gray-900">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="month"
                    {...register("institution_end_date")}
                    min="1980-01"
                    max="2035-12"
                    disabled={isCurrentlyStudying}
                    className="block w-full pl-10 pr-4 py-3.5 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm hover:border-primary-300 bg-white font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Select month and year"
                  />
                </div>
                {errors.institution_end_date && !isCurrentlyStudying && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span> {errors.institution_end_date.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {isCurrentlyStudying ? "Currently studying here" : "Graduation or expected date"}
                </p>
              </div>
            </div>

            {/* Currently Studying Toggle */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isCurrentlyStudying}
                    onChange={(e) => handleCurrentlyStudyingChange(e.target.checked)}
                    className="w-5 h-5 text-primary-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors">
                    📚 I am currently studying at this institution
                  </span>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Check this if you haven't graduated yet
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Conditional Document Requirements */}
        {watchedEducation && documentReqs.required.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  📋 Document Requirements for {watchedEducation}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {documentReqs.notes}
                </p>

                {/* Required Documents */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Required Documents:
                  </h5>
                  <div className="space-y-2">
                    {documentReqs.required.map((doc, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white rounded-lg p-3 shadow-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Documents */}
                {documentReqs.optional.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Optional (but recommended):
                    </h5>
                    <div className="space-y-2">
                      {documentReqs.optional.map((doc, index) => (
                        <div key={index} className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                          <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>
                      You'll be able to upload these documents after your application is submitted.
                      Keep them ready for faster processing.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
              GPA (4.0 scale) {!isHighSchool && <span className="text-red-500">*</span>}
              {isHighSchool && <span className="text-gray-500 text-xs ml-1">(Optional)</span>}
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
                placeholder={isHighSchool ? "e.g., 3.5 (optional)" : "e.g., 3.5"}
                min="0"
                max="4.0"
              />
            </div>
            {errors.gpa && !isHighSchool && (
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
