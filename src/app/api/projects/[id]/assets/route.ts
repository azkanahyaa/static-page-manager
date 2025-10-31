import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const type = searchParams.get('type')

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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
      return NextResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    // Build where clause
    const where: any = {
      projectId,
    }

    if (folder) {
      where.folder = folder
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    const assets = await prisma.asset.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(assets)

  } catch (error) {
    console.error('Assets fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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
      return NextResponse.json({ message: 'Project not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || null
    const alt = formData.get('alt') as string || null

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ message: 'File too large. Maximum size is 10MB' }, { status: 400 })
    }

    // Determine asset type
    const getAssetType = (mimeType: string) => {
      if (mimeType.startsWith('image/')) return 'IMAGE'
      if (mimeType.startsWith('video/')) return 'VIDEO'
      if (mimeType.includes('pdf') || mimeType.includes('document')) return 'DOCUMENT'
      if (mimeType.includes('font')) return 'FONT'
      return 'OTHER'
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFilename = `${uuidv4()}.${fileExtension}`

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', projectId)
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const filePath = join(uploadDir, uniqueFilename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create asset record
    const asset = await prisma.asset.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${projectId}/${uniqueFilename}`,
        type: getAssetType(file.type) as any,
        folder,
        alt,
        projectId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(asset, { status: 201 })

  } catch (error) {
    console.error('Asset upload error:', error)
    return NextResponse.json(
      { message: 'Failed to upload asset' },
      { status: 500 }
    )
  }
}