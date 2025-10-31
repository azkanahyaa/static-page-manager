import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePageSchema = z.object({
  title: z.string().min(1, 'Page title is required').optional(),
  slug: z.string().min(1, 'Page slug is required').optional(),
  content: z.string().optional(),
  htmlContent: z.string().optional(),
  cssContent: z.string().optional(),
  jsContent: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isHomePage: z.boolean().optional(),
})

// GET /api/projects/[id]/pages/[pageId] - Get specific page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, pageId } = await params
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

    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
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
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/pages/[pageId] - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, pageId } = await params
    const body = await request.json()
    const validatedData = updatePageSchema.parse(body)

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

    // Check if page exists
    const existingPage = await prisma.page.findFirst({
      where: {
        id: pageId,
        projectId: id
      }
    })

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugConflict = await prisma.page.findUnique({
        where: {
          projectId_slug: {
            projectId: id,
            slug: validatedData.slug
          }
        }
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // If this is set as home page, update existing home page
    if (validatedData.isHomePage && !existingPage.isHomePage) {
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

    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: {
        ...validatedData,
        htmlContent: validatedData.htmlContent || validatedData.content || existingPage.htmlContent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(updatedPage)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/pages/[pageId] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pageId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, pageId } = await params
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

    // Check if page exists and is not the home page
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        projectId: id
      }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    if (page.isHomePage) {
      return NextResponse.json(
        { error: 'Cannot delete the home page' },
        { status: 400 }
      )
    }

    await prisma.page.delete({
      where: { id: pageId }
    })

    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}