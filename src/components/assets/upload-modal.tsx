'use client'

import { useState, useRef, useCallback } from 'react'
import { X, Upload, Image, FileText, File } from 'lucide-react'
import { toast } from 'sonner'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: FileList) => Promise<void>
  projectId: string
}

export default function UploadModal({ isOpen, onClose, onUpload, projectId }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleUpload(files)
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleUpload(files)
    }
  }, [])

  const handleUpload = async (files: FileList) => {
    setIsUploading(true)
    try {
      await onUpload(files)
      onClose()
      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />
    } else if (file.type.includes('text') || file.type.includes('document')) {
      return <FileText className="h-8 w-8 text-green-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upload Assets</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Support for images, documents, and other file types
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-primary"
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>• Maximum file size: 10MB</p>
            <p>• Supported formats: Images, Videos, Audio, Documents</p>
          </div>
        </div>

        {isUploading && (
          <div className="px-6 pb-6">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Uploading files...</p>
          </div>
        )}
      </div>
    </div>
  )
}