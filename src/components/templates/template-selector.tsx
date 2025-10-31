'use client'

import { useState, useEffect } from 'react'
import { Search, FileText, Layout, Smartphone, Globe, Palette, Code } from 'lucide-react'

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

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template | null) => void
  selectedTemplate: Template | null
}

const categoryIcons = {
  'Landing Page': Globe,
  'Portfolio': Palette,
  'Blog': FileText,
  'Business': Layout,
  'E-commerce': Smartphone,
  'Other': Code,
}

const categories = [
  'All',
  'Landing Page',
  'Portfolio',
  'Blog',
  'Business',
  'E-commerce',
  'Other',
]

export default function TemplateSelector({
  onSelectTemplate,
  selectedTemplate,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`/api/templates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleTemplateSelect = (template: Template) => {
    if (selectedTemplate?.id === template.id) {
      onSelectTemplate(null)
    } else {
      onSelectTemplate(template)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose a Template
        </h3>
        <p className="text-sm text-gray-600">
          Start with a pre-built template or create from scratch
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blank Template Option */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <button
          onClick={() => onSelectTemplate(null)}
          className={`w-full text-left transition-colors ${
            selectedTemplate === null
              ? 'bg-primary-50 border-primary-200'
              : 'hover:bg-gray-50'
          } border rounded-lg p-4`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Start from Scratch</h4>
              <p className="text-sm text-gray-600">
                Create a blank project with basic HTML structure
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Try adjusting your search terms or filters'
              : 'No templates available in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || Code
            const isSelected = selectedTemplate?.id === template.id

            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`border rounded-lg p-4 text-left transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Template Preview */}
                <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IconComponent className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {/* Template Info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {template.name}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="mt-3 flex items-center text-primary-600">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}