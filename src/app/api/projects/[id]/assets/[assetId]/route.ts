import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId, assetId } = await params

    // Verify project access and get asset
    const asset = await prisma.asset.findFirst({
      where: {
        id: assetId,
        project: {
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

    if (!asset) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json(asset)

  } catch (error) {
    console.error('Asset fetch error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch asset' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId, assetId } = await params
    const body = await request.json()

    // Verify project access
    const existingAsset = await prisma.asset.findFirst({
      where: {
        id: assetId,
        project: {
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
      }
    })

    if (!existingAsset) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 })
    }

    // Update asset
    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        folder: body.folder,
        alt: body.alt,
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

    return NextResponse.json(asset)

  } catch (error) {
    console.error('Asset update error:', error)
    return NextResponse.json(
      { message: 'Failed to update asset' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId, assetId } = await params

    // Verify project access and get asset
    const asset = await prisma.asset.findFirst({
      where: {
        id: assetId,
        project: {
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
      }
    })

    if (!asset) {
      return NextResponse.json({ message: 'Asset not found' }, { status: 404 })
    }

    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', asset.url)
      await unlink(filePath)
    } catch (fileError) {
      console.warn('Failed to delete file from filesystem:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete asset from database
    await prisma.asset.delete({
      where: { id: assetId }
    })

    return NextResponse.json({ message: 'Asset deleted successfully' })

  } catch (error) {
    console.error('Asset deletion error:', error)
    return NextResponse.json(
      { message: 'Failed to delete asset' },
      { status: 500 }
    )
  }
}