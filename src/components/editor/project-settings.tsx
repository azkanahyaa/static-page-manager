'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Users, 
  Globe, 
  Settings,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { getPreviewUrl, getCurrentOrigin } from '@/lib/url'

interface User {
  id: string
  email: string
  name?: string | null
}

interface Project {
  id: string
  name: string
  slug: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

interface ProjectSettingsProps {
  projectId: string
  user: User
}

export default function ProjectSettings({ projectId, user }: ProjectSettingsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          status: data.status
        })
      } else if (response.status === 404) {
        toast.error('Project not found')
        router.push('/dashboard')
      } else {
        toast.error('Failed to fetch project')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to fetch project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const saveProject = async () => {
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProject(updatedProject)
        toast.success('Project updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Project deleted successfully')
        router.push('/dashboard')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const exportProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${project?.slug || 'project'}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Project exported successfully')
      } else {
        toast.error('Failed to export project')
      }
    } catch (error) {
      console.error('Error exporting project:', error)
      toast.error('Failed to export project')
    }
  }

  const copyPublicUrl = async () => {
    try {
      const publicUrl = getPreviewUrl(formData.slug)
      await navigator.clipboard.writeText(publicUrl)
      toast.success('Public URL copied to clipboard')
    } catch (error) {
      console.error('Error copying URL:', error)
      toast.error('Failed to copy URL')
    }
  }

  const openPublicUrl = () => {
    const publicUrl = getPreviewUrl(formData.slug)
    window.open(publicUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Project Settings</h1>
              <p className="text-sm text-gray-500">{project.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportProject}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Export
            </button>
            
            <button
              onClick={saveProject}
              disabled={isSaving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="project-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.status === 'DRAFT' && 'Project is in development and not publicly accessible.'}
                  {formData.status === 'PUBLISHED' && 'Project is live and publicly accessible.'}
                  {formData.status === 'ARCHIVED' && 'Project is archived and not accessible.'}
                </p>
              </div>
            </div>
          </div>

          {/* Publishing Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Globe className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Publishing</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Public Access</h3>
                  <p className="text-sm text-gray-500">
                    {formData.status === 'PUBLISHED' 
                      ? 'Your project is publicly accessible'
                      : 'Your project is private'
                    }
                  </p>
                </div>
                <div className="flex items-center">
                  {formData.status === 'PUBLISHED' ? (
                    <Eye className="h-5 w-5 text-green-500" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {formData.status === 'PUBLISHED' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Public URL</h4>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded text-sm text-gray-900 font-mono">
                      {getPreviewUrl(formData.slug)}
                    </code>
                    <button 
                      onClick={copyPublicUrl}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                      title="Copy URL to clipboard"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                    <button 
                      onClick={openPublicUrl}
                      className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm flex items-center space-x-1"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open</span>
                    </button>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    This URL is publicly accessible and can be shared with anyone.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Team Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
            </div>

            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Team Features Coming Soon</h3>
              <p className="text-gray-600 mb-4">
                Invite team members and manage permissions for collaborative editing.
              </p>
              <button className="btn-secondary" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Invite Members
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <div className="flex items-center mb-6">
              <Trash2 className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-sm font-medium text-red-900 mb-2">Delete Project</h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete a project, there is no going back. Please be certain.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete Project
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-red-900">
                      Are you absolutely sure? This action cannot be undone.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={deleteProject}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Yes, Delete Project
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}