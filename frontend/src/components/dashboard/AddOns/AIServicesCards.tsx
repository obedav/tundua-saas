'use client'

import Link from 'next/link'
import { Sparkles, FileEdit, GraduationCap, Briefcase, ArrowRight } from 'lucide-react'

export default function AIServicesCards() {
  const aiServices = [
    {
      name: 'AI SOP Generator',
      description: 'Generate a professional Statement of Purpose in minutes',
      price: '₦8,000',
      oldPrice: '₦25,000',
      href: '/dashboard/addons/ai-sop-generator',
      icon: FileEdit,
      tag: 'Instant',
      savings: '68% off',
      color: 'blue',
    },
    {
      name: 'AI University Report',
      description: 'Get 10 personalized university recommendations',
      price: '₦5,000',
      oldPrice: '₦18,000',
      href: '/dashboard/addons/ai-university-report',
      icon: GraduationCap,
      tag: 'Instant',
      savings: '72% off',
      color: 'green',
    },
    {
      name: 'AI Resume Optimizer',
      description: 'Optimize your resume for maximum impact',
      price: '₦5,000',
      oldPrice: '₦15,000',
      href: '/dashboard/addons/ai-resume-optimizer',
      icon: Briefcase,
      tag: 'Instant',
      savings: '67% off',
      color: 'purple',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">AI-Powered Services</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Generate Professional Documents Instantly
        </h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Save time and money with AI-powered document generation. Get instant results at a fraction of the cost.
        </p>
      </div>

      {/* AI Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiServices.map((service) => {
          const Icon = service.icon
          return (
            <Link
              key={service.href}
              href={service.href}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${service.color}-100 dark:bg-${service.color}-900/30`}>
                  <Icon className={`h-6 w-6 text-${service.color}-600 dark:text-${service.color}-400`} />
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold rounded">
                    {service.tag}
                  </span>
                  <div className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                    {service.savings}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-12">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {service.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                    {service.oldPrice}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                  <span className="text-sm">Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bundle Package */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Best Value</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Complete Package Bundle</h3>
            <p className="text-blue-100 mb-4">
              Get all 3 AI services and save ₦3,000!
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">₦15,000</span>
              <span className="text-xl text-blue-200 line-through">₦18,000</span>
            </div>
          </div>
          <Link
            href="/dashboard/addons"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            View Bundle Package
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Why Choose AI Services?
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Instant Delivery</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get results in seconds, not days</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Save 60-70%</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Affordable pricing for students</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">High Quality</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered professional results</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔄</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Free Revisions</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">2 AI revision rounds included</p>
          </div>
        </div>
      </div>
    </div>
  )
}
