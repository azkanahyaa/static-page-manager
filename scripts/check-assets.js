const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function checkAssets() {
  try {
    const projectId = 'cmhd5u8vw0004bzy0qtsox7s0'
    
    console.log('🔍 Checking assets for project:', projectId)
    
    // Check database records
    const dbAssets = await prisma.asset.findMany({
      where: { projectId },
      select: {
        id: true,
        filename: true,
        originalName: true,
        url: true,
        type: true,
        createdAt: true
      }
    })
    
    console.log('\n📊 Database Assets:')
    console.log(`Found ${dbAssets.length} asset records in database`)
    dbAssets.forEach(asset => {
      console.log(`- ${asset.filename} (${asset.originalName}) - ${asset.type}`)
    })
    
    // Check file system
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', projectId)
    console.log('\n📁 File System Assets:')
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir)
      console.log(`Found ${files.length} files in uploads directory`)
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file)
        const stats = fs.statSync(filePath)
        console.log(`- ${file} (${(stats.size / 1024).toFixed(2)} KB)`)
      })
      
      // Check for orphaned files
      const dbFilenames = dbAssets.map(asset => asset.filename)
      const orphanedFiles = files.filter(file => !dbFilenames.includes(file))
      
      if (orphanedFiles.length > 0) {
        console.log('\n⚠️  Orphaned Files (exist in filesystem but not in database):')
        orphanedFiles.forEach(file => console.log(`- ${file}`))
      }
      
      // Check for missing files
      const missingFiles = dbFilenames.filter(filename => !files.includes(filename))
      if (missingFiles.length > 0) {
        console.log('\n❌ Missing Files (exist in database but not in filesystem):')
        missingFiles.forEach(file => console.log(`- ${file}`))
      }
      
    } else {
      console.log('Uploads directory does not exist')
    }
    
  } catch (error) {
    console.error('Error checking assets:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAssets()