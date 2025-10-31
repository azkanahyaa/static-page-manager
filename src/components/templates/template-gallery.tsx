'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Star,
  Clock,
  User,
  Grid,
  List,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import InputModal from '../ui/input-modal'

interface User {
  id: string
  email: string
  name?: string | null
}

interface Template {
  id: string
  name: string
  description?: string
  htmlContent: string
  cssContent?: string
  jsContent?: string
  isPublic: boolean
  createdAt: string
  author?: {
    name?: string
    email: string
  }
}

interface TemplateGalleryProps {
  user: User
}

export default function TemplateGallery({ user }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [templateForProject, setTemplateForProject] = useState<Template | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchTerm])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        toast.error('Failed to fetch templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to fetch templates')
    } finally {
      setIsLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTemplates(filtered)
  }

  const useTemplate = (template: Template) => {
    setTemplateForProject(template)
    setShowCreateProjectModal(true)
  }

  const handleCreateProject = async (projectName: string) => {
    if (!templateForProject) return

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          templateId: templateForProject.id,
        }),
      })

      if (response.ok) {
        const project = await response.json()
        toast.success('Project created successfully')
        router.push(`/projects/${project.id}`)
      } else {
        toast.error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    }
  }

  const previewTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
              onClick={() => router.push('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Template Gallery</h1>
              <p className="text-sm text-gray-500">
                Choose from {templates.length} professional templates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Grid className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No templates found' : 'No templates available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Templates will appear here once they are added'
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Template Preview */}
                <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'} bg-gray-100 relative group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 opacity-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-primary-600">
                          {template.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{template.name}</p>
                    </div>
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => previewTemplate(template)}
                      className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => useTemplate(template)}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      title="Use Template"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                    <div className="flex items-center text-yellow-500 ml-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                  
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{template.author?.name || 'StaticManager'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(template.createdAt)}</span>
                    </div>
                  </div>

                  {viewMode === 'list' && (
                    <div className="flex items-center space-x-2 mt-4">
                      <button
                        onClick={() => previewTemplate(template)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2 inline" />
                        Preview
                      </button>
                      <button
                        onClick={() => useTemplate(template)}
                        className="flex-1 btn-primary text-sm"
                      >
                        <Plus className="h-4 w-4 mr-2 inline" />
                        Use Template
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview: {selectedTemplate.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => useTemplate(selectedTemplate)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Use Template
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="h-96 bg-gray-100">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <style>${selectedTemplate.cssContent || ''}</style>
                  </head>
                  <body>
                    ${selectedTemplate.htmlContent}
                    <script>${selectedTemplate.jsContent || ''}</script>
                  </body>
                  </html>
                `}
                className="w-full h-full border-0"
                title="Template Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <InputModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onConfirm={handleCreateProject}
        title="Create Project from Template"
        placeholder="Enter project name"
        description={templateForProject ? `Create a new project from "${templateForProject.name}" template` : ''}
      />
    </div>
  )
}