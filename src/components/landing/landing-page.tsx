'use client'

import Link from 'next/link'
import { ArrowRight, Code, Globe, Zap, Shield, Users, Palette } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">StaticManager</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/signin" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup" 
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Beautiful Static Websites with 
            <span className="text-primary-600"> Professional Tools</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A production-ready platform for creating, managing, and deploying static websites 
            with advanced editing capabilities, team collaboration, and powerful analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Start Building <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#features" 
              className="btn-outline text-lg px-8 py-4"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Build Amazing Websites
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional-grade tools and features designed for developers, designers, and content creators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Code className="h-8 w-8 text-primary-600" />}
            title="Advanced Code Editor"
            description="Monaco Editor with syntax highlighting, auto-completion, and real-time preview for HTML, CSS, and JavaScript."
          />
          <FeatureCard
            icon={<Palette className="h-8 w-8 text-primary-600" />}
            title="Visual Builder"
            description="Drag-and-drop interface with pre-built components and templates to speed up your development process."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary-600" />}
            title="Team Collaboration"
            description="Multi-user support with role-based permissions, project sharing, and real-time collaboration features."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary-600" />}
            title="Fast Deployment"
            description="One-click deployment to multiple platforms with automatic optimization and CDN integration."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary-600" />}
            title="Secure & Reliable"
            description="Enterprise-grade security with automated backups, version control, and 99.9% uptime guarantee."
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-primary-600" />}
            title="SEO Optimized"
            description="Built-in SEO tools, meta tag management, and performance optimization for better search rankings."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Your Next Website?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers and designers who trust StaticManager 
            for their static website projects.
          </p>
          <Link 
            href="/auth/signup" 
            className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center"
          >
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Globe className="h-6 w-6" />
              <span className="text-xl font-bold">StaticManager</span>
            </div>
            <div className="text-gray-400">
              © 2024 StaticManager. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}