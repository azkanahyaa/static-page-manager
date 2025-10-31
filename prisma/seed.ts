import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@staticmanager.com' },
    update: {},
    create: {
      email: 'demo@staticmanager.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'EDITOR',
    },
  })

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@staticmanager.com' },
    update: {},
    create: {
      email: 'admin@staticmanager.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create some sample templates
  const template1 = await prisma.template.upsert({
    where: { id: 'template-1' },
    update: {},
    create: {
      id: 'template-1',
      name: 'Landing Page',
      description: 'A modern landing page template',
      category: 'Business',
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
</head>
<body>
    <header>
        <h1>Welcome to Our Service</h1>
        <p>The best solution for your business needs</p>
    </header>
    <main>
        <section>
            <h2>Features</h2>
            <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
            </ul>
        </section>
    </main>
</body>
</html>`,
      cssContent: `body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
header { text-align: center; margin-bottom: 40px; }
h1 { color: #333; }`,
      isPublic: true,
    },
  })

  const template2 = await prisma.template.upsert({
    where: { id: 'template-2' },
    update: {},
    create: {
      id: 'template-2',
      name: 'Portfolio',
      description: 'A clean portfolio template',
      category: 'Portfolio',
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
</head>
<body>
    <header>
        <h1>John Doe</h1>
        <p>Web Developer & Designer</p>
    </header>
    <main>
        <section>
            <h2>About Me</h2>
            <p>I'm a passionate web developer with 5 years of experience.</p>
        </section>
        <section>
            <h2>Projects</h2>
            <div class="project">
                <h3>Project 1</h3>
                <p>Description of project 1</p>
            </div>
        </section>
    </main>
</body>
</html>`,
      cssContent: `body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 20px; }
.project { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }`,
      isPublic: true,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Demo user:', demoUser)
  console.log('Admin user:', adminUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })