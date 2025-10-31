'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Monitor, Smartphone, Tablet, RotateCcw, ExternalLink, AlertCircle, Terminal } from 'lucide-react'

interface LivePreviewProps {
  htmlContent: string
  cssContent: string
  jsContent: string
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

const viewportSizes = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '375px', height: '667px', label: 'Mobile' }
}

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
  timestamp: number
}

export default function LivePreview({ htmlContent, cssContent, jsContent }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])

  // Debounced update to prevent too frequent refreshes
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const doc = iframe.contentDocument || iframe.contentWindow?.document

    if (!doc) return

    setHasError(false)
    setConsoleMessages([])

    // Create the complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          /* Reset styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          
          /* User CSS */
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent}
        
        <script>
          // Override console methods to capture output
          if (typeof window.originalConsole === 'undefined') {
            window.originalConsole = {
              log: console.log,
              error: console.error,
              warn: console.warn,
              info: console.info
            };
          }
          
          function sendToParent(type, message) {
            try {
              window.parent.postMessage({
                type: 'console',
                level: type,
                message: String(message),
                timestamp: Date.now()
              }, '*');
            } catch (e) {
              // Ignore errors when posting to parent
            }
          }
          
          console.log = function(...args) {
            window.originalConsole.log.apply(console, args);
            sendToParent('log', args.join(' '));
          };
          
          console.error = function(...args) {
            window.originalConsole.error.apply(console, args);
            sendToParent('error', args.join(' '));
          };
          
          console.warn = function(...args) {
            window.originalConsole.warn.apply(console, args);
            sendToParent('warn', args.join(' '));
          };
          
          console.info = function(...args) {
            window.originalConsole.info.apply(console, args);
            sendToParent('info', args.join(' '));
          };
          
          // Capture JavaScript errors
          window.addEventListener('error', function(e) {
            sendToParent('error', 'Error: ' + e.message + ' at line ' + e.lineno);
          });
          
          window.addEventListener('unhandledrejection', function(e) {
            sendToParent('error', 'Unhandled Promise Rejection: ' + e.reason);
          });
          
          // Prevent external navigation
          document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (target && target.href && !target.href.startsWith('#')) {
              e.preventDefault();
              console.log('External link clicked:', target.href);
            }
          });
          
          // User JavaScript
          try {
            ${jsContent}
          } catch (error) {
            console.error('JavaScript execution error:', error.message);
          }
        </script>
      </body>
      </html>
    `

    try {
      doc.open()
      doc.write(fullHtml)
      doc.close()
    } catch (error) {
      setHasError(true)
      console.error('Preview update error:', error)
    }
  }, [htmlContent, cssContent, jsContent])

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        const newMessage: ConsoleMessage = {
          type: event.data.level,
          message: event.data.message,
          timestamp: event.data.timestamp
        }
        
        setConsoleMessages(prev => [...prev.slice(-49), newMessage]) // Keep last 50 messages
        
        if (event.data.level === 'error') {
          setHasError(true)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Debounced update effect
  useEffect(() => {
    const timeoutId = setTimeout(updatePreview, 300)
    return () => clearTimeout(timeoutId)
  }, [updatePreview])

  const refreshPreview = () => {
    setIsRefreshing(true)
    setConsoleMessages([])
    setHasError(false)
    setTimeout(() => {
      updatePreview()
      setIsRefreshing(false)
    }, 300)
  }

  const openInNewTab = () => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            
            ${cssContent}
          </style>
        </head>
        <body>
          ${htmlContent}
          
          <script>
            try {
              ${jsContent}
            } catch (error) {
              console.error('JavaScript error:', error);
            }
          </script>
        </body>
        </html>
      `
      
      newWindow.document.write(fullHtml)
      newWindow.document.close()
    }
  }

  const clearConsole = () => {
    setConsoleMessages([])
    setHasError(false)
  }

  const getConsoleIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '❌'
      case 'warn':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📝'
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
            <span className="text-xs text-gray-500">
              {viewportSizes[viewport].label}
            </span>
            {hasError && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Error</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Console Toggle */}
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`p-2 rounded transition-colors ${
                showConsole
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              } ${hasError ? 'text-red-600' : ''}`}
              title="Toggle Console"
            >
              <Terminal className="h-4 w-4" />
              {consoleMessages.length > 0 && (
                <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1">
                  {consoleMessages.length}
                </span>
              )}
            </button>

            {/* Viewport Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1 rounded transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop View"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1 rounded transition-colors ${
                  viewport === 'tablet'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet View"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1 rounded transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={refreshPreview}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Refresh Preview"
            >
              <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openInNewTab}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Console Panel */}
      {showConsole && (
        <div className="bg-gray-900 text-gray-100 border-b border-gray-200 h-32 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <span className="text-sm font-medium">Console</span>
            <button
              onClick={clearConsole}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 text-xs font-mono">
            {consoleMessages.length === 0 ? (
              <div className="text-gray-500">No console output</div>
            ) : (
              consoleMessages.map((msg, index) => (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={`mb-1 ${
                    msg.type === 'error'
                      ? 'text-red-400'
                      : msg.type === 'warn'
                      ? 'text-yellow-400'
                      : msg.type === 'info'
                      ? 'text-blue-400'
                      : 'text-gray-300'
                  }`}
                >
                  <span className="mr-2">{getConsoleIcon(msg.type)}</span>
                  {msg.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="bg-white border border-gray-300 shadow-lg overflow-hidden"
          style={{
            width: viewportSizes[viewport].width,
            height: viewportSizes[viewport].height,
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: viewport !== 'desktop' ? '12px' : '4px',
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}