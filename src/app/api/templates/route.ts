import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category } : {}

    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
        ...where,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      category,
      thumbnail,
      htmlContent,
      cssContent,
      jsContent,
      isPublic = false,
    } = body

    if (!name || !htmlContent || !category) {
      return NextResponse.json(
        { error: 'Name, HTML content, and category are required' },
        { status: 400 }
      )
    }

    const template = await prisma.template.create({
      data: {
        name,
        description,
        category,
        thumbnail,
        htmlContent,
        cssContent: cssContent || '',
        jsContent: jsContent || '',
        isPublic,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
