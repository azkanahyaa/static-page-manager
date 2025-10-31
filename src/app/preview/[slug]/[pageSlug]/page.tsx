import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface PreviewPageProps {
  params: Promise<{ slug: string; pageSlug: string }>
}

export default async function PreviewPagePage({ params }: PreviewPageProps) {
  const { slug, pageSlug } = await params

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

  // Find the specific page by slug
  const page = project.pages.find((p: any) => p.slug === pageSlug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/preview/${slug}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {project.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{page.title}</span>
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
        {page.cssContent && (
          <style dangerouslySetInnerHTML={{ __html: page.cssContent }} />
        )}
        
        {/* HTML Content */}
        <div dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }} />
        
        {/* JavaScript */}
        {page.jsContent && (
          <script dangerouslySetInnerHTML={{ __html: page.jsContent }} />
        )}
      </div>

      {/* Page Navigation */}
      {project.pages.length > 1 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="text-xs text-gray-500 mb-2">Pages:</div>
          <div className="space-y-1">
            {project.pages.map((p: any) => (
              <Link
                key={p.id}
                href={p.isHomePage ? `/preview/${slug}` : `/preview/${slug}/${p.slug}`}
                className={`block px-3 py-1 text-sm rounded transition-colors ${
                  p.id === page.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: PreviewPageProps) {
  const { slug, pageSlug } = await params

  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: 'PUBLISHED'
    },
    include: {
      pages: true
    }
  })

  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  const page = project.pages.find((p: any) => p.slug === pageSlug)

  if (!page) {
    return {
      title: 'Page Not Found'
    }
  }

  return {
    title: page.metaTitle || `${page.title} - ${project.name}`,
    description: page.metaDesc || project.description || `${page.title} from ${project.name}`,
    keywords: page.keywords
  }
}