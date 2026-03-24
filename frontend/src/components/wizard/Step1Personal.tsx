"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApplicationData } from "@/app/dashboard/applications/new/page";
import { useEffect } from "react";
import PassportUpload from "./PassportUpload";
import { PassportData } from "@/lib/passport-ocr";
import { User, Mail, Phone, Calendar, Globe, MapPin, CreditCard, Sparkles } from "lucide-react";
import { COUNTRIES, POPULAR_COUNTRIES } from "@/lib/countries";

const schema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),
  passport_number: z.string().optional(),
  current_country: z.string().min(2, "Current country is required"),
  current_city: z.string().min(2, "Current city is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: ApplicationData;
  updateData: (data: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Reusable input classes */
const inputClass = "block w-full pl-10 pr-4 py-3 border-2 border-gray-400 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm hover:border-primary-400 dark:bg-gray-700 dark:text-white";
const selectClass = `${inputClass} bg-white dark:bg-gray-700`;
const iconClass = "h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors";

/** Country <select> with popular countries first */
function CountrySelect({ id, register, error, placeholder }: {
  id: string;
  register: any;
  error?: string;
  placeholder: string;
}) {
  return (
    <div>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Globe className={iconClass} />
        </div>
        <select {...register(id)} className={selectClass}>
          <option value="">{placeholder}</option>
          <optgroup label="Popular">
            {POPULAR_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="All Countries">
            {COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c as any)).map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </optgroup>
        </select>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default function Step1Personal({ data, updateData, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  useEffect(() => {
    if (data.first_name) setValue("first_name", data.first_name);
    if (data.last_name) setValue("last_name", data.last_name);
    if (data.email) setValue("email", data.email);
    if (data.phone) setValue("phone", data.phone);
  }, [data, setValue]);

  const handlePassportData = (passportData: PassportData) => {
    if (passportData.firstName) setValue("first_name", passportData.firstName);
    if (passportData.lastName) setValue("last_name", passportData.lastName);
    if (passportData.passportNumber) setValue("passport_number", passportData.passportNumber);
    if (passportData.nationality) setValue("nationality", passportData.nationality);
    if (passportData.dateOfBirth) setValue("date_of_birth", passportData.dateOfBirth);
  };

  const onSubmit = (formData: FormData) => {
    updateData(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Passport Quick Fill */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-4 sm:p-5 border border-primary-200 dark:border-primary-700">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Quick Fill with Passport</h3>
          <span className="text-[10px] bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">AI-Powered</span>
        </div>
        <PassportUpload onDataExtracted={handlePassportData} />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 dark:text-gray-500">or fill manually</span>
        </div>
      </div>

      {/* Personal Details */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          Personal Details
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={iconClass} />
              </div>
              <input type="text" {...register("first_name")} className={inputClass} placeholder="e.g. Ade" />
            </div>
            {errors.first_name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.first_name.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className={iconClass} />
              </div>
              <input type="text" {...register("last_name")} className={inputClass} placeholder="e.g. Ogundimu" />
            </div>
            {errors.last_name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.last_name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={iconClass} />
              </div>
              <input type="email" {...register("email")} className={inputClass} placeholder="you@email.com" />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className={iconClass} />
              </div>
              <input type="tel" {...register("phone")} className={inputClass} placeholder="+234 801 234 5678" />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className={iconClass} />
              </div>
              <input type="date" {...register("date_of_birth")} className={inputClass} />
            </div>
            {errors.date_of_birth && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.date_of_birth.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Identification */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <Globe className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          Identification
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nationality */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nationality <span className="text-red-500">*</span>
            </label>
            <CountrySelect id="nationality" register={register} error={errors.nationality?.message} placeholder="Select nationality" />
          </div>

          {/* Passport Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Passport Number <span className="text-gray-400 text-[10px]">(optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className={iconClass} />
              </div>
              <input type="text" {...register("passport_number")} className={inputClass} placeholder="e.g. A12345678" />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          Current Location
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Current Country */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Country <span className="text-red-500">*</span>
            </label>
            <CountrySelect id="current_country" register={register} error={errors.current_country?.message} placeholder="Select country" />
          </div>

          {/* Current City */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className={iconClass} />
              </div>
              <input type="text" {...register("current_city")} className={inputClass} placeholder="e.g. Lagos" />
            </div>
            {errors.current_city && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.current_city.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Hidden submit */}
      <button type="submit" className="hidden" id="step1-submit-btn">Next</button>
    </form>
  );
}
