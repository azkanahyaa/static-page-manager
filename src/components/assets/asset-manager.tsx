'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  FolderOpen,
  Image,
  FileText,
  Video,
  Eye,
  Copy,
  MoreVertical,
  Trash2,
  Download,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface Asset {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'FONT' | 'OTHER'
  folder?: string
  alt?: string
  createdAt: string
  user: {
    name?: string
    email: string
  }
}

interface AssetManagerProps {
  projectId: string
  onAssetSelect?: (asset: Asset) => void
  selectionMode?: boolean
}

export default function AssetManager({ 
  projectId, 
  onAssetSelect, 
  selectionMode = false 
}: AssetManagerProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    assetId: string
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [projectId])

  useEffect(() => {
    filterAssets()
  }, [assets, searchTerm, selectedFolder, selectedType])

  const fetchAssets = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedFolder) params.append('folder', selectedFolder)
      if (selectedType) params.append('type', selectedType)

      const response = await fetch(`/api/projects/${projectId}/assets?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      } else {
        toast.error('Failed to fetch assets')
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
      toast.error('Failed to fetch assets')
    } finally {
      setIsLoading(false)
    }
  }

  const filterAssets = () => {
    let filtered = assets

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.alt?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedFolder) {
      filtered = filtered.filter(asset => asset.folder === selectedFolder)
    }

    if (selectedType) {
      filtered = filtered.filter(asset => asset.type === selectedType)
    }

    setFilteredAssets(filtered)
  }

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return

    setIsUploading(true)
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      if (selectedFolder) {
        formData.append('folder', selectedFolder)
      }

      try {
        const response = await fetch(`/api/projects/${projectId}/assets`, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const asset = await response.json()
          return asset
        } else {
          const error = await response.json()
          throw new Error(error.message || 'Upload failed')
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload ${file.name}`)
        return null
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter(Boolean)
      
      if (successfulUploads.length > 0) {
        toast.success(`Successfully uploaded ${successfulUploads.length} file(s)`)
        fetchAssets()
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
      setShowUploadModal(false)
    }
  }, [projectId, selectedFolder])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const deleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}/assets/${assetId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Asset deleted successfully')
        fetchAssets()
      } else {
        toast.error('Failed to delete asset')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete asset')
    }
  }

  const copyAssetUrl = (asset: Asset) => {
    navigator.clipboard.writeText(asset.url)
    toast.success('Asset URL copied to clipboard')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-5 w-5" />
      case 'VIDEO':
        return <Video className="h-5 w-5" />
      case 'DOCUMENT':
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const folders = [...new Set(assets.map(asset => asset.folder).filter(Boolean))]
  const types = [...new Set(assets.map(asset => asset.type))]

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Asset Manager</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </button>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
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

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={selectedFolder || ''}
            onChange={(e) => setSelectedFolder(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Folders</option>
            {folders.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>

          <select
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedFolder || selectedType ? 'No assets found' : 'No assets yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedFolder || selectedType 
                ? 'Try adjusting your filters'
                : 'Upload your first asset to get started'
              }
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Assets
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
              : 'space-y-2'
          }>
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                viewMode={viewMode}
                selectionMode={selectionMode}
                onSelect={() => onAssetSelect?.(asset)}
                onView={() => {
                  setSelectedAsset(asset)
                  setShowAssetModal(true)
                }}
                onDelete={() => deleteAsset(asset.id)}
                onCopyUrl={() => copyAssetUrl(asset)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
          isUploading={isUploading}
        />
      )}

      {/* Asset Detail Modal */}
      {showAssetModal && selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setShowAssetModal(false)}
          onDelete={() => {
            deleteAsset(selectedAsset.id)
            setShowAssetModal(false)
          }}
          onCopyUrl={() => copyAssetUrl(selectedAsset)}
        />
      )}
    </div>
  )
}

// Asset Card Component
interface AssetCardProps {
  asset: Asset
  viewMode: 'grid' | 'list'
  selectionMode: boolean
  onSelect: () => void
  onView: () => void
  onDelete: () => void
  onCopyUrl: () => void
}

function AssetCard({ 
  asset, 
  viewMode, 
  selectionMode, 
  onSelect, 
  onView, 
  onDelete, 
  onCopyUrl 
}: AssetCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-5 w-5" />
      case 'VIDEO':
        return <Video className="h-5 w-5" />
      case 'DOCUMENT':
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex-shrink-0 mr-3">
          {asset.type === 'IMAGE' ? (
            <img
              src={asset.url}
              alt={asset.alt || asset.originalName}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              {getAssetIcon(asset.type)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {asset.originalName}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(asset.size)} • {asset.type}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectionMode ? (
            <button
              onClick={onSelect}
              className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
            >
              Select
            </button>
          ) : (
            <>
              <button
                onClick={onView}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Eye className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        onCopyUrl()
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </button>
                    <button
                      onClick={() => {
                        onDelete()
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-square bg-gray-100 relative">
        {asset.type === 'IMAGE' ? (
          <img
            src={asset.url}
            alt={asset.alt || asset.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getAssetIcon(asset.type)}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          {selectionMode ? (
            <button
              onClick={onSelect}
              className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Select
            </button>
          ) : (
            <>
              <button
                onClick={onView}
                className="p-2 bg-white text-gray-900 rounded hover:bg-gray-100"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={onCopyUrl}
                className="p-2 bg-white text-gray-900 rounded hover:bg-gray-100"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-white text-red-600 rounded hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {asset.originalName}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(asset.size)}
        </p>
      </div>
    </div>
  )
}

// Upload Modal Component
interface UploadModalProps {
  onClose: () => void
  onUpload: (files: FileList) => void
  isUploading: boolean
}

function UploadModal({ onClose, onUpload, isUploading }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upload Assets</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Support for images, videos, documents, and more
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && onUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-primary cursor-pointer"
            >
              Choose Files
            </label>
          </div>
          
          {isUploading && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Asset Detail Modal Component
interface AssetDetailModalProps {
  asset: Asset
  onClose: () => void
  onDelete: () => void
  onCopyUrl: () => void
}

function AssetDetailModal({ asset, onClose, onDelete, onCopyUrl }: AssetDetailModalProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Asset Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Preview */}
          <div className="mb-6">
            {asset.type === 'IMAGE' ? (
              <img
                src={asset.url}
                alt={asset.alt || asset.originalName}
                className="max-w-full h-auto max-h-64 mx-auto rounded"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center mx-auto">
                {asset.type === 'VIDEO' && <Video className="h-12 w-12 text-gray-400" />}
                {asset.type === 'DOCUMENT' && <FileText className="h-12 w-12 text-gray-400" />}
                {!['VIDEO', 'DOCUMENT'].includes(asset.type) && <FileText className="h-12 w-12 text-gray-400" />}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name
              </label>
              <p className="text-sm text-gray-900">{asset.originalName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <p className="text-sm text-gray-900">{asset.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <p className="text-sm text-gray-900">{formatFileSize(asset.size)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm">
                  {asset.url}
                </code>
                <button
                  onClick={onCopyUrl}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {asset.alt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <p className="text-sm text-gray-900">{asset.alt}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uploaded By
              </label>
              <p className="text-sm text-gray-900">
                {asset.user.name || asset.user.email}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2 inline" />
              Delete Asset
            </button>
            
            <a
              href={asset.url}
              download={asset.originalName}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}