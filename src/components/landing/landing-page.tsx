'use client'

import Link from 'next/link'
import { ArrowRight, Code, Globe, Zap, Shield, Users, Palette, Clock, DollarSign, Server, AlertTriangle } from 'lucide-react'

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
            Turn any website idea into reality in 
            <span className="text-primary-600"> minutes, not hours</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            These days, AI can help you create stunning websites instantly - but here's the catch: 
            getting them online, managing updates, and collaborating with others is still a nightmare 
            of FTP uploads, server configs, and broken deployment pipelines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#solution" 
              className="btn-outline text-lg px-8 py-4"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Here's what you get instead...
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <SolutionCard
              icon={<Code className="h-8 w-8 text-primary-600" />}
              title="Professional code editor"
              description="Monaco Editor with syntax highlighting, autocomplete, and IntelliSense"
            />
            <SolutionCard
              icon={<Globe className="h-8 w-8 text-primary-600" />}
              title="Static site publishing"
              description="Publish your sites instantly without complex hosting setups"
            />
            <SolutionCard
              icon={<Palette className="h-8 w-8 text-primary-600" />}
              title="Template system"
              description="Start with professional templates and customize them to your needs"
            />
            <SolutionCard
              icon={<Shield className="h-8 w-8 text-primary-600" />}
              title="Secure file management"
              description="Organized asset management with user authentication and project control"
            />
          </div>
        </div>
      </section>

      {/* Real Scenarios Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real scenarios...
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ScenarioCard
              title="AI-generated website editing"
              description="ChatGPT created your website code, but now you need to refine it. Instead of switching between multiple tools, use StaticManager's Monaco Editor to polish your code with professional autocomplete and syntax highlighting, then publish it as a static site."
              highlight="Professional editing + instant publishing"
            />
            <ScenarioCard
              title="Template-based development"
              description="Start with a professional template from our gallery, customize it with the built-in code editor, manage your assets securely, and publish your static site without complex hosting setups."
              highlight="Template → Edit → Publish"
            />
          </div>
        </div>
      </section>

      {/* Additional Benefits Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What you get right now...
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <BenefitCard
              icon={<Code className="h-8 w-8 text-white" />}
              title="Professional editing"
              description="Monaco Editor gives you VS Code-level editing in the browser"
            />
            <BenefitCard
              icon={<Zap className="h-8 w-8 text-white" />}
              title="Instant publishing"
              description="No FTP, no complex deployments - just publish your static sites"
            />
            <BenefitCard
              icon={<Shield className="h-8 w-8 text-white" />}
              title="Static site security"
              description="No databases to hack, no servers to compromise - just secure static files"
            />
            <BenefitCard
              icon={<Palette className="h-8 w-8 text-white" />}
              title="Template foundation"
              description="Start with professional templates and customize them to your needs"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Tools That Actually Work
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to turn AI-generated websites into production-ready sites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Code className="h-8 w-8 text-primary-600" />}
            title="Monaco Code Editor"
            description="Professional code editor with syntax highlighting, auto-completion, and IntelliSense - just like VS Code."
          />
          <FeatureCard
            icon={<Palette className="h-8 w-8 text-primary-600" />}
            title="Template Gallery"
            description="Start with professional templates and customize them with the built-in editor."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-primary-600" />}
            title="User Management"
            description="Secure authentication and project management with role-based access control."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary-600" />}
            title="Static Site Publishing"
            description="Publish your static sites instantly - no complex deployment pipelines required."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary-600" />}
            title="File & Asset Management"
            description="Organized file uploads, asset management, and secure project storage."
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-primary-600" />}
            title="Coming Soon: Advanced Features"
            description="Visual builder, team collaboration, analytics, and deployment integrations are in development."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to build static sites like the pros?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            StaticManager transforms how teams create, collaborate, and deploy static websites. 
            Experience the future of static website management.
          </p>
          <Link 
            href="/auth/signup" 
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center"
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

interface SolutionCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

interface ScenarioCardProps {
  title: string
  description: string
  highlight: string
}

function ScenarioCard({ title, description, highlight }: ScenarioCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
      <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
        {highlight}
      </div>
    </div>
  )
}

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-white/90 leading-relaxed">{description}</p>
    </div>
  )
}