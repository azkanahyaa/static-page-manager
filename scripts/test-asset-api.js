const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAssetAPI() {
  try {
    const projectId = 'cmhd5u8vw0004bzy0qtsox7s0'
    
    console.log('🧪 Testing Asset API for project:', projectId)
    
    // Test database query (same as API)
    const assets = await prisma.asset.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📊 Assets from database:')
    console.log(`Found ${assets.length} assets`)
    
    assets.forEach(asset => {
      console.log(`\n- Asset ID: ${asset.id}`)
      console.log(`  Filename: ${asset.filename}`)
      console.log(`  Original Name: ${asset.originalName}`)
      console.log(`  URL: ${asset.url}`)
      console.log(`  Type: ${asset.type}`)
      console.log(`  Size: ${asset.size} bytes`)
      console.log(`  Folder: ${asset.folder || 'None'}`)
      console.log(`  Alt: ${asset.alt || 'None'}`)
      console.log(`  Created: ${asset.createdAt}`)
      console.log(`  User: ${asset.user.name || asset.user.email}`)
    })
    
    if (assets.length === 0) {
      console.log('\n⚠️  No assets found in database for this project')
    } else {
      console.log('\n✅ Assets found - API should return these assets')
    }
    
  } catch (error) {
    console.error('❌ Error testing asset API:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAssetAPI()