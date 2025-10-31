'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { loader } from '@monaco-editor/react'
import { Code, Loader } from 'lucide-react'

interface MonacoEditorProps {
  value: string
  language: string
  onChange: (value: string) => void
  height?: string
  theme?: string
}

export default function MonacoEditor({
  value,
  language,
  onChange,
  height = '100%',
  theme = 'vs-dark'
}: MonacoEditorProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Configure Monaco Editor to use local assets instead of CDN
    loader.config({
      paths: {
        vs: '/monaco-editor/min/vs'
      }
    })
  }, [])

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  const handleEditorDidMount = () => {
    setIsLoading(false)
  }

  return (
    <div style={{ height, width: '100%' }} className="border border-gray-200">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading editor...</p>
          </div>
        </div>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
          },
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading editor...</p>
            </div>
          </div>
        }
      />
    </div>
  )
}