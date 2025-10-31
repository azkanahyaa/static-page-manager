'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Globe, 
  Settings, 
  LogOut, 
  FolderOpen, 
  FileText, 
  Users, 
  BarChart3,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Eye,
  ChevronRight,
  ChevronLeft,
  Layout
} from 'lucide-react'
import { toast } from 'sonner'
import TemplateSelector from '@/components/templates/template-selector'

interface User {
  id: string
  email: string
  name?: string | null
  role: string
  avatar?: string | null
}

interface Project {
  id: string
  name: string
  slug: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  thumbnail?: string
  createdAt: string
  updatedAt: string
  _count: {
    pages: number
    assets: number
  }
}

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        toast.error('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Project deleted successfully')
        fetchProjects()
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length.toString(), 
      icon: FolderOpen, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Published Sites', 
      value: projects.filter(p => p.status === 'PUBLISHED').length.toString(), 
      icon: Globe, 
      color: 'text-green-600' 
    },
    { 
      label: 'Total Pages', 
      value: projects.reduce((acc, p) => acc + p._count.pages, 0).toString(), 
      icon: FileText, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Total Assets', 
      value: projects.reduce((acc, p) => acc + p._count.assets, 0).toString(), 
      icon: Users, 
      color: 'text-orange-600' 
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Globe className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">StaticManager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'User'}!
          </h2>
          <p className="text-gray-600">
            Manage your static websites and track your progress from your dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Projects</h3>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                  <Filter className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {projects.length === 0 ? 'No projects yet' : 'No projects found'}
                </h4>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Create your first project to start building amazing websites.'
                    : 'Try adjusting your search terms.'
                  }
                </p>
                {projects.length === 0 && (
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={() => router.push(`/projects/${project.id}/edit`)}
                    onDelete={() => handleDeleteProject(project.id)}
                    onView={() => router.push(`/projects/${project.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Create New Project"
            description="Start a new static website project"
            icon={<Plus className="h-6 w-6" />}
            onClick={() => setShowCreateModal(true)}
          />
          <QuickActionCard
            title="Browse Templates"
            description="Choose from pre-built templates"
            icon={<FileText className="h-6 w-6" />}
            onClick={() => router.push('/templates')}
          />
          <QuickActionCard
            title="View Analytics"
            description="Check your website performance"
            icon={<BarChart3 className="h-6 w-6" />}
            onClick={() => toast.info('Analytics coming soon!')}
          />
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false)
              fetchProjects()
            }}
          />
        )}
      </main>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}

function QuickActionCard({ title, description, icon, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-primary-600 group-hover:text-primary-700 transition-colors">
          {icon}
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  )
}

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Project Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {project.thumbnail ? (
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="h-12 w-12 text-white opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={onView}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="View project"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit project"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {project._count.pages} pages
            </span>
            <span className="flex items-center">
              <FolderOpen className="h-4 w-4 mr-1" />
              {project._count.assets} assets
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(project.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  thumbnail: string | null
  htmlContent: string
  cssContent: string | null
  jsContent: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface CreateProjectModalProps {
  onClose: () => void
  onSuccess: () => void
}

function CreateProjectModal({ onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'template' | 'details'>('template')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          templateId: selectedTemplate?.id || undefined,
        }),
      })

      if (response.ok) {
        toast.success('Project created successfully')
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    setStep('details')
  }

  const handleBack = () => {
    setStep('template')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
              <div className="flex items-center mt-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'template' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
                }`}>
                  1
                </div>
                <div className="w-12 h-0.5 bg-gray-200 mx-2">
                  <div className={`h-full transition-all duration-300 ${
                    step === 'details' ? 'bg-primary-600 w-full' : 'bg-gray-200 w-0'
                  }`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'details' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-3 text-sm text-gray-600">
                  {step === 'template' ? 'Choose Template' : 'Project Details'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Plus className="h-6 w-6 rotate-45" />
            </button>
          </div>

          {step === 'template' ? (
            <div className="space-y-6">
              <TemplateSelector
                onSelectTemplate={setSelectedTemplate}
                selectedTemplate={selectedTemplate}
              />
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Template Preview */}
              {selectedTemplate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Layout className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="My Awesome Website"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description of your project"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    Create Project
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}