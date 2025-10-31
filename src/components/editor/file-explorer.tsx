'use client'

import { useState } from 'react'
import { 
  FileText, 
  Home, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen
} from 'lucide-react'
import { toast } from 'sonner'
import InputModal from '../ui/input-modal'

interface Page {
  id: string
  title: string
  slug: string
  htmlContent?: string
  cssContent?: string
  jsContent?: string
  isHomePage: boolean
}

interface FileExplorerProps {
  pages: Page[]
  onPageSelect: (page: Page) => void
  activePageId: string | null
  onSwitchToAssets?: () => void
}

export default function FileExplorer({ pages, onPageSelect, activePageId, onSwitchToAssets }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['pages']))
  const [contextMenu, setContextMenu] = useState<{
    pageId: string
    x: number
    y: number
  } | null>(null)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renamePageId, setRenamePageId] = useState<string | null>(null)
  const [renameDefaultValue, setRenameDefaultValue] = useState('')

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleContextMenu = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault()
    setContextMenu({
      pageId,
      x: e.clientX,
      y: e.clientY
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleRename = (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return

    setRenamePageId(pageId)
    setRenameDefaultValue(page.title)
    setShowRenameModal(true)
    closeContextMenu()
  }

  const handleRenameConfirm = (newTitle: string) => {
    const page = pages.find(p => p.id === renamePageId)
    if (!page || newTitle === page.title) return

    // TODO: Implement rename API call
    toast.success('Page renamed successfully')
  }

  const handleDuplicate = (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return

    // TODO: Implement duplicate API call
    toast.success('Page duplicated successfully')
    closeContextMenu()
  }

  const handleDelete = (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return

    if (page.isHomePage) {
      toast.error('Cannot delete the home page')
      closeContextMenu()
      return
    }

    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      // TODO: Implement delete API call
      toast.success('Page deleted successfully')
    }
    closeContextMenu()
  }

  // Close context menu when clicking outside
  const handleClick = () => {
    if (contextMenu) {
      closeContextMenu()
    }
  }

  return (
    <div className="flex-1 overflow-y-auto" onClick={handleClick}>
      {/* Pages Folder */}
      <div className="p-2">
        <div
          className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => toggleFolder('pages')}
        >
          {expandedFolders.has('pages') ? (
            <ChevronDown className="h-4 w-4 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1" />
          )}
          {expandedFolders.has('pages') ? (
            <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
          )}
          Pages
        </div>

        {expandedFolders.has('pages') && (
          <div className="ml-4 mt-1">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`flex items-center justify-between px-2 py-1 text-sm rounded cursor-pointer group ${
                  activePageId === page.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onPageSelect(page)}
                onContextMenu={(e) => handleContextMenu(e, page.id)}
              >
                <div className="flex items-center min-w-0 flex-1">
                  {page.isHomePage ? (
                    <Home className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{page.title}</span>
                  {page.isHomePage && (
                    <span className="ml-1 text-xs text-green-600">(Home)</span>
                  )}
                </div>
                
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleContextMenu(e, page.id)
                  }}
                >
                  <MoreVertical className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assets Folder (Placeholder) */}
      <div className="p-2">
        <div
          className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => toggleFolder('assets')}
        >
          {expandedFolders.has('assets') ? (
            <ChevronDown className="h-4 w-4 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1" />
          )}
          {expandedFolders.has('assets') ? (
            <FolderOpen className="h-4 w-4 mr-2 text-purple-500" />
          ) : (
            <Folder className="h-4 w-4 mr-2 text-purple-500" />
          )}
          Assets
        </div>

        {expandedFolders.has('assets') && (
          <div className="ml-4 mt-1">
            <button
              onClick={onSwitchToAssets}
              className="w-full px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded text-left transition-colors"
            >
              View in Assets tab →
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => handleRename(contextMenu.pageId)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => handleDuplicate(contextMenu.pageId)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </button>
          <hr className="my-1" />
          <button
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            onClick={() => handleDelete(contextMenu.pageId)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      )}

      {/* Rename Modal */}
      <InputModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onConfirm={handleRenameConfirm}
        title="Rename Page"
        placeholder="Enter new page title"
        defaultValue={renameDefaultValue}
        description="Enter a new title for this page"
      />
    </div>
  )
}