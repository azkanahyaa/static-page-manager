/**
 * Utility functions for generating URLs
 */

/**
 * Get the base URL for the application
 */
export function getBaseUrl(): string {
  // In production, use the VERCEL_URL or custom domain
  if (process.env.NODE_ENV === 'production') {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }
    // Fallback for production
    return 'https://your-domain.com'
  }
  
  // In development, use localhost
  return 'http://localhost:3000'
}

/**
 * Generate a public preview URL for a project
 */
export function getPreviewUrl(slug: string): string {
  return `${getBaseUrl()}/preview/${slug}`
}

/**
 * Generate a public preview URL for a specific page
 */
export function getPagePreviewUrl(projectSlug: string, pageSlug: string): string {
  return `${getBaseUrl()}/preview/${projectSlug}/${pageSlug}`
}

/**
 * Check if we're running on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Get the current origin (client-side only)
 */
export function getCurrentOrigin(): string {
  if (isClient()) {
    return window.location.origin
  }
  return getBaseUrl()
}