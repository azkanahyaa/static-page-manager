import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import JSZip from 'jszip'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

    // Get project with pages and assets
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      include: {
        pages: true,
        assets: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create ZIP file
    const zip = new JSZip()

    // Add pages to ZIP
    for (const page of project.pages) {
      const fileName = page.slug === 'index' ? 'index.html' : `${page.slug}.html`
      
      // Create complete HTML document
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title || project.name}</title>
    <style>
${page.cssContent || ''}
    </style>
</head>
<body>
${page.htmlContent || ''}
    <script>
${page.jsContent || ''}
    </script>
</body>
</html>`

      zip.file(fileName, htmlContent)
    }

    // Add assets to ZIP
    const assetsFolder = zip.folder('assets')
    for (const asset of project.assets) {
      if (asset.url) {
        try {
          // For demo purposes, we'll create placeholder files
          // In a real implementation, you'd fetch the actual file content
          const fileExtension = asset.filename.split('.').pop()
          let content = ''
          
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension?.toLowerCase() || '')) {
            content = `<!-- Image placeholder: ${asset.filename} -->`
          } else if (['css'].includes(fileExtension?.toLowerCase() || '')) {
            content = `/* CSS file: ${asset.filename} */`
          } else if (['js'].includes(fileExtension?.toLowerCase() || '')) {
            content = `// JavaScript file: ${asset.filename}`
          } else {
            content = `File: ${asset.filename}`
          }
          
          assetsFolder?.file(asset.filename, content)
        } catch (error) {
          console.error(`Error adding asset ${asset.filename}:`, error)
        }
      }
    }

    // Add README file
    const readmeContent = `# ${project.name}

${project.description || 'No description provided.'}

## Project Structure

- **HTML Files**: Main pages of your website
- **assets/**: Static assets (images, CSS, JavaScript files)

## Deployment

You can deploy this static website to any web hosting service:

1. **Netlify**: Drag and drop this folder to netlify.com/drop
2. **Vercel**: Use the Vercel CLI or connect your Git repository
3. **GitHub Pages**: Upload to a GitHub repository and enable Pages
4. **Traditional Hosting**: Upload files via FTP to your web server

## Local Development

To run locally, simply open the HTML files in your web browser or use a local server:

\`\`\`bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
\`\`\`

Generated on: ${new Date().toISOString()}
Project ID: ${project.id}
`

    zip.file('README.md', readmeContent)

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return ZIP file
    const fileName = `${project.slug || project.name.toLowerCase().replace(/\s+/g, '-')}.zip`
    
    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export project' },
      { status: 500 }
    )
  }
}