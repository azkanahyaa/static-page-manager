import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  templateId: z.string().optional(),
})

// GET /api/projects - Get user's projects
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get projects where user is owner
    const ownedProjects = await prisma.project.findMany({
      where: {
        userId: session.user.id
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
        members: {
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
        },
        pages: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            updatedAt: true
          }
        },
        _count: {
          select: {
            pages: true,
            assets: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Get projects where user is a member
    const memberProjects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        },
        NOT: {
          userId: session.user.id // Exclude projects where user is already the owner
        }
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
        members: {
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
        },
        pages: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            updatedAt: true
          }
        },
        _count: {
          select: {
            pages: true,
            assets: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Combine and sort all projects
    const allProjects = [...ownedProjects, ...memberProjects].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    return NextResponse.json(allProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Generate unique slug
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let slug = baseSlug
    let counter = 1
    
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        templateId: validatedData.templateId,
        userId: session.user.id,
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
        _count: {
          select: {
            pages: true,
            assets: true
          }
        }
      }
    })

    // If template is selected, create initial page from template
    if (validatedData.templateId) {
      const template = await prisma.template.findUnique({
        where: { id: validatedData.templateId }
      })

      if (template) {
        await prisma.page.create({
          data: {
            title: 'Home',
            slug: 'index',
            content: template.htmlContent,
            htmlContent: template.htmlContent,
            cssContent: template.cssContent,
            jsContent: template.jsContent,
            isHomePage: true,
            status: 'DRAFT',
            projectId: project.id,
            userId: session.user.id,
          }
        })
      }
    } else {
      // Create default home page
      await prisma.page.create({
        data: {
          title: 'Home',
          slug: 'index',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${validatedData.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${validatedData.name}</h1>
        <p>Your new static website is ready! Start editing to create something amazing.</p>
    </div>
</body>
</html>`,
          htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${validatedData.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${validatedData.name}</h1>
        <p>Your new static website is ready! Start editing to create something amazing.</p>
    </div>
</body>
</html>`,
          isHomePage: true,
          status: 'DRAFT',
          projectId: project.id,
          userId: session.user.id,
        }
      })
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
