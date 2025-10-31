import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PreviewPageProps {
  params: Promise<{ slug: string }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params

  // Find the published project by slug
  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: 'PUBLISHED'
    },
    include: {
      pages: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (!project) {
    notFound()
  }

  // Get the home page or first page
  const homePage = project.pages.find((page: any) => page.isHomePage) || project.pages[0]

  if (!homePage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <p className="text-gray-600">No pages found in this project.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Live Preview
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {project.description}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative">
        {/* CSS Styles */}
        {homePage.cssContent && (
          <style dangerouslySetInnerHTML={{ __html: homePage.cssContent }} />
        )}
        
        {/* HTML Content */}
        <div dangerouslySetInnerHTML={{ __html: homePage.htmlContent || '' }} />
        
        {/* JavaScript */}
        {homePage.jsContent && (
          <script dangerouslySetInnerHTML={{ __html: homePage.jsContent }} />
        )}
      </div>

      {/* Page Navigation (if multiple pages) */}
      {project.pages.length > 1 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="text-xs text-gray-500 mb-2">Pages:</div>
          <div className="space-y-1">
            {project.pages.map((page: any) => (
              <a
                key={page.id}
                href={`/preview/${slug}/${page.slug}`}
                className={`block px-3 py-1 text-sm rounded transition-colors ${
                  page.id === homePage.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: PreviewPageProps) {
  const { slug } = await params

  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: 'PUBLISHED'
    },
    include: {
      pages: {
        where: { isHomePage: true },
        take: 1
      }
    }
  })

  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  const homePage = project.pages[0]

  return {
    title: homePage?.metaTitle || project.name,
    description: homePage?.metaDesc || project.description || `Preview of ${project.name}`,
    keywords: homePage?.keywords
  }
}