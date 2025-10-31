'use client'

import { useState } from 'react'
import { X, Download, Trash2, Copy, Edit3, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Asset {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER'
  folder?: string
  alt?: string
  createdAt: string
}

interface AssetDetailModalProps {
  asset: Asset | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (assetId: string, updates: { folder?: string; alt?: string }) => Promise<void>
  onDelete: (assetId: string) => Promise<void>
}

export default function AssetDetailModal({ 
  asset, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete 
}: AssetDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editFolder, setEditFolder] = useState('')
  const [editAlt, setEditAlt] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!isOpen || !asset) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(asset.url)
      toast.success('Asset URL copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const downloadAsset = () => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${asset.originalName}"?`)) {
      try {
        await onDelete(asset.id)
        onClose()
        toast.success('Asset deleted successfully')
      } catch (error) {
        toast.error('Failed to delete asset')
      }
    }
  }

  const startEditing = () => {
    setEditFolder(asset.folder || '')
    setEditAlt(asset.alt || '')
    setIsEditing(true)
  }

  const saveChanges = async () => {
    setIsUpdating(true)
    try {
      await onUpdate(asset.id, {
        folder: editFolder || undefined,
        alt: editAlt || undefined
      })
      setIsEditing(false)
      toast.success('Asset updated successfully')
    } catch (error) {
      toast.error('Failed to update asset')
    } finally {
      setIsUpdating(false)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditFolder(asset.folder || '')
    setEditAlt(asset.alt || '')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Asset Details</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Asset Preview */}
          <div className="mb-6">
            {asset.type === 'IMAGE' ? (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.alt || asset.originalName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600">{asset.originalName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Asset Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">File Information</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Original Name</dt>
                  <dd className="text-sm text-gray-900">{asset.originalName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">File Name</dt>
                  <dd className="text-sm text-gray-900">{asset.filename}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">{asset.mimeType}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Size</dt>
                  <dd className="text-sm text-gray-900">{formatFileSize(asset.size)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Uploaded</dt>
                  <dd className="text-sm text-gray-900">{formatDate(asset.createdAt)}</dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Metadata</h4>
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Folder</label>
                    <input
                      type="text"
                      value={editFolder}
                      onChange={(e) => setEditFolder(e.target.value)}
                      placeholder="e.g., images, documents"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  {asset.type === 'IMAGE' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        placeholder="Describe the image"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={saveChanges}
                      disabled={isUpdating}
                      className="btn-primary text-xs"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {isUpdating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="btn-secondary text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs text-gray-500">Folder</dt>
                    <dd className="text-sm text-gray-900">{asset.folder || 'None'}</dd>
                  </div>
                  {asset.type === 'IMAGE' && (
                    <div>
                      <dt className="text-xs text-gray-500">Alt Text</dt>
                      <dd className="text-sm text-gray-900">{asset.alt || 'None'}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-gray-500">URL</dt>
                    <dd className="text-sm text-gray-900 break-all">{asset.url}</dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={copyUrl}
              className="btn-secondary"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </button>
            <button
              onClick={downloadAsset}
              className="btn-secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
          
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}