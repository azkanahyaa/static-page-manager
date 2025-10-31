import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  {
    name: 'Modern Landing Page',
    description: 'A clean and modern landing page with hero section, features, and call-to-action',
    category: 'Landing Page',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">Brand</div>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>Welcome to the Future</h1>
                <p>Transform your business with our innovative solutions</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="features" class="features">
            <div class="container">
                <h2>Features</h2>
                <div class="features-grid">
                    <div class="feature">
                        <h3>Fast</h3>
                        <p>Lightning-fast performance</p>
                    </div>
                    <div class="feature">
                        <h3>Secure</h3>
                        <p>Enterprise-grade security</p>
                    </div>
                    <div class="feature">
                        <h3>Scalable</h3>
                        <p>Grows with your business</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 Brand. All rights reserved.</p>
    </footer>
</body>
</html>`,
    cssContent: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #6366f1;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #6366f1;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8rem 2rem 4rem;
    text-align: center;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: #fff;
    color: #6366f1;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

.features {
    padding: 4rem 2rem;
    background: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.features h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
}

.feature h3 {
    color: #6366f1;
    margin-bottom: 1rem;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
}`,
    jsContent: `// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// CTA button click handler
document.querySelector('.cta-button').addEventListener('click', () => {
    alert('Welcome! This is where you would integrate your signup/contact form.');
});`,
    isPublic: true,
  },
  {
    name: 'Portfolio Showcase',
    description: 'A clean portfolio template perfect for showcasing your work and skills',
    category: 'Portfolio',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Showcase</title>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="name">John Doe</h1>
            <nav class="nav">
                <a href="#about">About</a>
                <a href="#portfolio">Portfolio</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h2>Creative Designer</h2>
            <p>I create beautiful and functional digital experiences</p>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>I'm a passionate designer with 5+ years of experience creating digital solutions that combine aesthetics with functionality.</p>
                    <div class="skills">
                        <span class="skill">UI/UX Design</span>
                        <span class="skill">Web Development</span>
                        <span class="skill">Branding</span>
                        <span class="skill">Photography</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="portfolio" class="portfolio">
        <div class="container">
            <h2>My Work</h2>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <div class="portfolio-image"></div>
                    <h3>Project One</h3>
                    <p>Web Design</p>
                </div>
                <div class="portfolio-item">
                    <div class="portfolio-image"></div>
                    <h3>Project Two</h3>
                    <p>Mobile App</p>
                </div>
                <div class="portfolio-item">
                    <div class="portfolio-image"></div>
                    <h3>Project Three</h3>
                    <p>Branding</p>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <p>Let's work together on your next project</p>
            <a href="mailto:john@example.com" class="contact-button">Contact Me</a>
        </div>
    </section>
</body>
</html>`,
    cssContent: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.header {
    background: #fff;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav a {
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    transition: color 0.3s;
}

.nav a:hover {
    color: #667eea;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8rem 2rem 4rem;
    text-align: center;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-content p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.about {
    padding: 4rem 0;
    background: #f7fafc;
}

.about h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #2d3748;
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #4a5568;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.skill {
    background: #667eea;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
}

.portfolio {
    padding: 4rem 0;
}

.portfolio h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #2d3748;
}

.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.portfolio-item {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.portfolio-item:hover {
    transform: translateY(-5px);
}

.portfolio-image {
    height: 200px;
    background: linear-gradient(45deg, #667eea, #764ba2);
}

.portfolio-item h3 {
    padding: 1rem;
    font-size: 1.2rem;
    color: #2d3748;
}

.portfolio-item p {
    padding: 0 1rem 1rem;
    color: #718096;
}

.contact {
    background: #2d3748;
    color: white;
    padding: 4rem 0;
    text-align: center;
}

.contact h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.contact p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.contact-button {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: background 0.3s;
}

.contact-button:hover {
    background: #5a67d8;
}

@media (max-width: 768px) {
    .header .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-content h2 {
        font-size: 2rem;
    }
    
    .portfolio-grid {
        grid-template-columns: 1fr;
    }
    
    .skills {
        justify-content: center;
    }
}`,
    jsContent: `// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});`,
    isPublic: true,
  },
  {
    name: 'Simple Blog',
    description: 'A minimal blog template with clean typography and reading-focused design',
    category: 'Blog',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Blog</title>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="blog-title">My Blog</h1>
            <nav class="nav">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <article class="post">
                <header class="post-header">
                    <h2 class="post-title">Welcome to My Blog</h2>
                    <div class="post-meta">
                        <time datetime="2024-01-15">January 15, 2024</time>
                        <span class="separator">•</span>
                        <span class="read-time">5 min read</span>
                    </div>
                </header>
                <div class="post-content">
                    <p>Welcome to my personal blog where I share thoughts, experiences, and insights about technology, design, and life.</p>
                    <p>This is a clean and minimal blog template that focuses on readability and content. The design is intentionally simple to let your words shine.</p>
                    <h3>What You'll Find Here</h3>
                    <ul>
                        <li>Technology insights and tutorials</li>
                        <li>Design inspiration and tips</li>
                        <li>Personal reflections and experiences</li>
                        <li>Book reviews and recommendations</li>
                    </ul>
                    <p>I believe in the power of sharing knowledge and experiences. Through this blog, I hope to connect with like-minded individuals and contribute to the community.</p>
                </div>
            </article>

            <article class="post">
                <header class="post-header">
                    <h2 class="post-title">The Art of Minimalism</h2>
                    <div class="post-meta">
                        <time datetime="2024-01-10">January 10, 2024</time>
                        <span class="separator">•</span>
                        <span class="read-time">3 min read</span>
                    </div>
                </header>
                <div class="post-content">
                    <p>Minimalism isn't just about having fewer things—it's about making room for what matters most.</p>
                    <p>In design, minimalism helps us focus on the essential elements and create more impactful experiences.</p>
                </div>
            </article>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 My Blog. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`,
    cssContent: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.7;
    color: #333;
    background: #fafafa;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
}

.header {
    background: #fff;
    border-bottom: 1px solid #e1e5e9;
    padding: 2rem 0;
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.blog-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav a {
    text-decoration: none;
    color: #7f8c8d;
    font-weight: 500;
    transition: color 0.3s;
}

.nav a:hover {
    color: #2c3e50;
}

.main {
    padding: 3rem 0;
}

.post {
    background: #fff;
    margin-bottom: 3rem;
    padding: 3rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.post-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ecf0f1;
}

.post-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.post-meta {
    color: #7f8c8d;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.separator {
    opacity: 0.5;
}

.post-content {
    font-size: 1.1rem;
    line-height: 1.8;
}

.post-content p {
    margin-bottom: 1.5rem;
}

.post-content h3 {
    font-size: 1.3rem;
    color: #2c3e50;
    margin: 2rem 0 1rem;
}

.post-content ul {
    margin: 1.5rem 0;
    padding-left: 2rem;
}

.post-content li {
    margin-bottom: 0.5rem;
}

.footer {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 2rem 0;
    text-align: center;
    margin-top: 3rem;
}

@media (max-width: 768px) {
    .header .container {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .post {
        padding: 2rem 1.5rem;
        margin-bottom: 2rem;
    }
    
    .post-title {
        font-size: 1.5rem;
    }
    
    .container {
        padding: 0 1rem;
    }
}`,
    jsContent: `// Add reading progress indicator
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = \`
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: #3498db;
        z-index: 1000;
        transition: width 0.3s;
    \`;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize features
document.addEventListener('DOMContentLoaded', () => {
    addReadingProgress();
});`,
    isPublic: true,
  },
]

async function seedTemplates() {
  console.log('Seeding templates...')

  for (const template of templates) {
    try {
      const existingTemplate = await prisma.template.findFirst({
        where: { name: template.name },
      })

      if (!existingTemplate) {
        await prisma.template.create({
          data: template,
        })
        console.log(`Created template: ${template.name}`)
      } else {
        console.log(`Template already exists: ${template.name}`)
      }
    } catch (error) {
      console.error(`Error creating template ${template.name}:`, error)
    }
  }

  console.log('Template seeding completed!')
}

seedTemplates()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })