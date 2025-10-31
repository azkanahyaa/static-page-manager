'use client'

import { useState } from 'react'
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  Copy, 
  Eye,
  Image as ImageIcon,
  FileText,
  File
} from 'lucide-react'
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

interface AssetCardProps {
  asset: Asset
  viewMode: 'grid' | 'list'
  onSelect?: (asset: Asset) => void
  onDelete?: (assetId: string) => void
  onViewDetails?: (asset: Asset) => void
}

export default function AssetCard({ 
  asset, 
  viewMode, 
  onSelect, 
  onDelete, 
  onViewDetails 
}: AssetCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAssetIcon = () => {
    switch (asset.type) {
      case 'IMAGE':
        return <ImageIcon className="h-4 w-4" />
      case 'DOCUMENT':
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(asset.url)
      toast.success('Asset URL copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy URL')
    }
    setShowMenu(false)
  }

  const downloadAsset = () => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${asset.originalName}"?`)) {
      onDelete?.(asset.id)
    }
    setShowMenu(false)
  }

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {asset.type === 'IMAGE' ? (
              <img
                src={asset.url}
                alt={asset.alt || asset.originalName}
                className="h-10 w-10 object-cover rounded"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                {getAssetIcon()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {asset.originalName}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(asset.size)} • {asset.mimeType}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelect?.(asset)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Select asset"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => onViewDetails?.(asset)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={copyUrl}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </button>
                <button
                  onClick={downloadAsset}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
      <div className="aspect-square relative">
        {asset.type === 'IMAGE' ? (
          <img
            src={asset.url}
            alt={asset.alt || asset.originalName}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onSelect?.(asset)}
          />
        ) : (
          <div 
            className="w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer"
            onClick={() => onSelect?.(asset)}
          >
            {getAssetIcon()}
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => onViewDetails?.(asset)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={copyUrl}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </button>
                <button
                  onClick={downloadAsset}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {asset.originalName}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatFileSize(asset.size)}
        </p>
      </div>
    </div>
  )
}