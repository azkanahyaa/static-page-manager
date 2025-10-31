import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPageSchema = z.object({
  title: z.string().min(1, 'Page title is required'),
  slug: z.string().min(1, 'Page slug is required'),
  content: z.string().optional().default(''),
  htmlContent: z.string().optional(),
  cssContent: z.string().optional(),
  jsContent: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  keywords: z.string().optional(),
  isHomePage: z.boolean().optional().default(false),
})

// GET /api/projects/[id]/pages - Get project pages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const pages = await prisma.page.findMany({
      where: {
        projectId: id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { isHomePage: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/pages - Create new page
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = createPageSchema.parse(body)

    // Check if user has permission to edit project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
                role: { in: ['OWNER', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or insufficient permissions' }, { status: 404 })
    }

    // Check if slug already exists in project
    const existingPage = await prisma.page.findUnique({
      where: {
        projectId_slug: {
          projectId: id,
          slug: validatedData.slug
        }
      }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    // If this is set as home page, update existing home page
    if (validatedData.isHomePage) {
      await prisma.page.updateMany({
        where: {
          projectId: id,
          isHomePage: true
        },
        data: {
          isHomePage: false
        }
      })
    }

    const page = await prisma.page.create({
      data: {
        ...validatedData,
        projectId: id,
        userId: session.user.id,
        htmlContent: validatedData.htmlContent || validatedData.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}