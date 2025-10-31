'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Settings, 
  Play, 
  Pause, 
  Plus, 
  FileText, 
  Code, 
  Palette,
  Image,
  X,
  ChevronRight,
  ChevronDown,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import MonacoEditor from './monaco-editor'
import FileExplorer from './file-explorer'
import LivePreview from './live-preview'
import AssetManager from '../assets/asset-manager'
import InputModal from '../ui/input-modal'

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
}

interface Page {
  id: string
  title: string
  slug: string
  htmlContent?: string
  cssContent?: string
  jsContent?: string
  isHomePage: boolean
}

interface ProjectEditorProps {
  projectId: string
  session: { user: User }
}

export default function ProjectEditor({ projectId, session }: ProjectEditorProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [openTabs, setOpenTabs] = useState<Page[]>([])
  const [activeEditor, setActiveEditor] = useState<'html' | 'css' | 'js'>('html')
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showAssetManager, setShowAssetManager] = useState(false)
  const [showNewPageModal, setShowNewPageModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProject()
    fetchPages()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else if (response.status === 404) {
        toast.error('Project not found')
        router.push('/dashboard')
      } else {
        toast.error('Failed to fetch project')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to fetch project')
    }
  }

  const fetchPages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${projectId}/pages`)
      if (response.ok) {
        const data = await response.json()
        setPages(data)
        
        // Open the home page by default
        const homePage = data.find((page: Page) => page.isHomePage)
        if (homePage) {
          openTab(homePage)
        }
      } else {
        toast.error('Failed to fetch pages')
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast.error('Failed to fetch pages')
    } finally {
      setIsLoading(false)
    }
  }

  const openTab = (page: Page) => {
    if (!openTabs.find(tab => tab.id === page.id)) {
      setOpenTabs(prev => [...prev, page])
    }
    setCurrentPage(page)
  }

  const closeTab = (pageId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== pageId)
    setOpenTabs(newTabs)
    
    if (currentPage?.id === pageId) {
      const newActiveTab = newTabs.length > 0 ? newTabs[newTabs.length - 1] : null
      setCurrentPage(newActiveTab)
    }
  }

  const handleContentChange = (content: string) => {
    if (!currentPage) return

    const updatedPage = {
      ...currentPage,
      [`${activeEditor}Content`]: content
    }

    setCurrentPage(updatedPage)
    
    // Update the page in openTabs
    setOpenTabs(prev => 
      prev.map(tab => 
        tab.id === currentPage.id ? updatedPage : tab
      )
    )
  }

  const saveProject = async () => {
    if (!currentPage) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/pages/${currentPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlContent: currentPage.htmlContent || '',
          cssContent: currentPage.cssContent || '',
          jsContent: currentPage.jsContent || '',
        }),
      })

      if (response.ok) {
        toast.success('Page saved successfully')
        fetchPages() // Refresh pages
      } else {
        toast.error('Failed to save page')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page')
    } finally {
      setIsSaving(false)
    }
  }

  const exportProject = async () => {
    if (!project) return

    setIsExporting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/export`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${project.slug || project.name.toLowerCase().replace(/\s+/g, '-')}.zip`
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
    } finally {
      setIsExporting(false)
    }
  }

  const createNewPage = () => {
    setShowNewPageModal(true)
  }

  const handleCreatePage = async (title: string) => {
    try {
      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim()
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

      const response = await fetch(`/api/projects/${projectId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          htmlContent: '<!DOCTYPE html>\n<html>\n<head>\n  <title>' + title + '</title>\n</head>\n<body>\n  <h1>' + title + '</h1>\n</body>\n</html>',
          cssContent: '',
          jsContent: '',
        }),
      })

      if (response.ok) {
        toast.success('Page created successfully')
        fetchPages()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create page')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('Failed to create page')
    }
  }

  const getEditorContent = () => {
    if (!currentPage) return ''
    return currentPage[`${activeEditor}Content`] || ''
  }

  const getEditorLanguage = () => {
    switch (activeEditor) {
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'js':
        return 'javascript'
      default:
        return 'html'
    }
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {project?.name || 'Loading...'}
            </h1>
            {currentPage && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{currentPage.title}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                showPreview
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showPreview ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              onClick={exportProject}
              disabled={isExporting}
              className="px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            
            <button
              onClick={saveProject}
              disabled={isSaving}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <a
              href={`/projects/${projectId}/edit`}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setShowAssetManager(false)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  !showAssetManager
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-4 w-4 mr-2 inline" />
                Files
              </button>
              <button
                onClick={() => setShowAssetManager(true)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  showAssetManager
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Image className="h-4 w-4 mr-2 inline" />
                Assets
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {showAssetManager ? (
              <AssetManager 
                projectId={projectId}
                onAssetSelect={(asset) => {
                  // Insert asset URL into current editor
                  if (currentPage && activeEditor === 'html') {
                    const imageTag = `<img src="${asset.url}" alt="${asset.alt || asset.originalName}" />`
                    // You can implement insertion logic here
                    toast.success('Asset URL copied to clipboard')
                    navigator.clipboard.writeText(asset.url)
                  } else {
                    navigator.clipboard.writeText(asset.url)
                    toast.success('Asset URL copied to clipboard')
                  }
                }}
              />
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Pages</h3>
                  <button
                    onClick={createNewPage}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <FileExplorer
                  pages={pages}
                  activePageId={currentPage?.id || null}
                  onPageSelect={setCurrentPage}
                  onSwitchToAssets={() => setShowAssetManager(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          {openTabs.length > 0 && (
            <div className="bg-white border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer transition-colors ${
                      currentPage?.id === tab.id
                        ? 'bg-gray-50 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentPage(tab)}
                  >
                    <span className="text-sm font-medium">{tab.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-200`}>
              {currentPage ? (
                <>
                  {/* Editor Type Selector */}
                  <div className="bg-white border-b border-gray-200 px-4 py-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setActiveEditor('html')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          activeEditor === 'html'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Code className="h-4 w-4 mr-1 inline" />
                        HTML
                      </button>
                      <button
                        onClick={() => setActiveEditor('css')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          activeEditor === 'css'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Palette className="h-4 w-4 mr-1 inline" />
                        CSS
                      </button>
                      <button
                        onClick={() => setActiveEditor('js')}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          activeEditor === 'js'
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <FileText className="h-4 w-4 mr-1 inline" />
                        JavaScript
                      </button>
                    </div>
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1">
                    <MonacoEditor
                      value={getEditorContent()}
                      language={getEditorLanguage()}
                      onChange={handleContentChange}
                      height="100%"
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No page selected</p>
                    <p className="text-sm">Select a page from the sidebar to start editing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Live Preview */}
            {showPreview && currentPage && (
              <div className="w-1/2">
                <LivePreview
                  htmlContent={currentPage.htmlContent || ''}
                  cssContent={currentPage.cssContent || ''}
                  jsContent={currentPage.jsContent || ''}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Page Modal */}
      <InputModal
        isOpen={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        onConfirm={handleCreatePage}
        title="Create New Page"
        placeholder="Enter page title"
        description="Enter a title for your new page"
      />
    </div>
  )
}