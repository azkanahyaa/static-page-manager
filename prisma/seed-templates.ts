import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  {
    name: 'Modern Landing Page',
    description: 'A clean, modern landing page with hero section and call-to-action',
    category: 'Landing Page',
    thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20clean%20landing%20page%20website%20design%20with%20hero%20section%20and%20call%20to%20action%20button&image_size=landscape_4_3',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 20px;
            text-align: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .hero-content {
            max-width: 600px;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .hero p {
            font-size: 1.25rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .features {
            padding: 80px 20px;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 50px;
        }
        
        .feature {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #667eea;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 20px;
        }
        
        .section-subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to the Future</h1>
            <p>Create amazing experiences with our modern, clean, and responsive design that works perfectly on all devices.</p>
            <a href="#features" class="cta-button">Get Started</a>
        </div>
    </section>
    
    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title">Amazing Features</h2>
            <p class="section-subtitle">Everything you need to build something amazing</p>
            
            <div class="features-grid">
                <div class="feature">
                    <h3>🚀 Fast Performance</h3>
                    <p>Lightning-fast loading times and optimized performance for the best user experience.</p>
                </div>
                
                <div class="feature">
                    <h3>📱 Responsive Design</h3>
                    <p>Looks great on all devices - from mobile phones to desktop computers.</p>
                </div>
                
                <div class="feature">
                    <h3>🎨 Modern UI</h3>
                    <p>Clean, modern design that follows the latest design trends and best practices.</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`,
    cssContent: '',
    jsContent: '',
    isPublic: true
  },
  {
    name: 'Portfolio Website',
    description: 'A professional portfolio template for showcasing your work',
    category: 'Portfolio',
    thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portfolio%20website%20design%20with%20project%20showcase%20grid%20and%20about%20section&image_size=landscape_4_3',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * {
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
            padding: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        .nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 30px;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: #667eea;
        }
        
        .hero {
            padding: 120px 20px 80px;
            text-align: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            color: #333;
        }
        
        .hero p {
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto 30px;
        }
        
        .projects {
            padding: 80px 20px;
            background: #fff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: #333;
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        
        .project-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-5px);
        }
        
        .project-image {
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }
        
        .project-content {
            padding: 25px;
        }
        
        .project-content h3 {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #333;
        }
        
        .project-content p {
            color: #666;
            margin-bottom: 15px;
        }
        
        .project-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
        
        .about {
            padding: 80px 20px;
            background: #f8fafc;
        }
        
        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        
        .about-content p {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">Portfolio</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <section class="hero" id="home">
        <h1>Hi, I'm John Doe</h1>
        <p>A passionate web developer creating amazing digital experiences with modern technologies and clean design.</p>
    </section>
    
    <section class="projects" id="projects">
        <div class="container">
            <h2 class="section-title">My Projects</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-image">Project Image</div>
                    <div class="project-content">
                        <h3>E-commerce Platform</h3>
                        <p>A modern e-commerce solution built with React and Node.js, featuring real-time inventory management.</p>
                        <a href="#" class="project-link">View Project →</a>
                    </div>
                </div>
                
                <div class="project-card">
                    <div class="project-image">Project Image</div>
                    <div class="project-content">
                        <h3>Task Management App</h3>
                        <p>A collaborative task management application with real-time updates and team collaboration features.</p>
                        <a href="#" class="project-link">View Project →</a>
                    </div>
                </div>
                
                <div class="project-card">
                    <div class="project-image">Project Image</div>
                    <div class="project-content">
                        <h3>Weather Dashboard</h3>
                        <p>A beautiful weather dashboard with interactive charts and location-based forecasts.</p>
                        <a href="#" class="project-link">View Project →</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <section class="about" id="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <p>I'm a full-stack developer with 5+ years of experience creating web applications that solve real-world problems.</p>
                <p>I specialize in React, Node.js, and modern web technologies. I'm passionate about clean code, user experience, and continuous learning.</p>
                <p>When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or enjoying the outdoors.</p>
            </div>
        </div>
    </section>
</body>
</html>`,
    cssContent: '',
    jsContent: '',
    isPublic: true
  },
  {
    name: 'Business Website',
    description: 'A professional business website template with services and contact sections',
    category: 'Business',
    thumbnail: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20website%20design%20with%20services%20section%20and%20contact%20form&image_size=landscape_4_3',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Solutions</title>
    <style>
        * {
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
            padding: 15px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2563eb;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 30px;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: #2563eb;
        }
        
        .hero {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 100px 20px;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #1e40af;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .services {
            padding: 80px 20px;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #333;
        }
        
        .section-subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto 50px;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }
        
        .service {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .service:hover {
            transform: translateY(-5px);
        }
        
        .service-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .service h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #2563eb;
        }
        
        .contact {
            padding: 80px 20px;
            background: white;
        }
        
        .contact-content {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .contact-form {
            display: grid;
            gap: 20px;
            margin-top: 40px;
        }
        
        .form-group {
            display: grid;
            gap: 5px;
        }
        
        .form-group label {
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea {
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #2563eb;
        }
        
        .submit-button {
            background: #2563eb;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .submit-button:hover {
            background: #1d4ed8;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .services-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">BusinessPro</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <section class="hero" id="home">
        <h1>Grow Your Business</h1>
        <p>We provide innovative solutions to help your business thrive in today's competitive market with cutting-edge technology and expert guidance.</p>
        <a href="#contact" class="cta-button">Get Started Today</a>
    </section>
    
    <section class="services" id="services">
        <div class="container">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">We offer comprehensive business solutions tailored to your needs</p>
            
            <div class="services-grid">
                <div class="service">
                    <div class="service-icon">💼</div>
                    <h3>Business Consulting</h3>
                    <p>Strategic guidance to optimize your business operations and drive growth through data-driven insights.</p>
                </div>
                
                <div class="service">
                    <div class="service-icon">🚀</div>
                    <h3>Digital Marketing</h3>
                    <p>Comprehensive digital marketing strategies to increase your online presence and reach your target audience.</p>
                </div>
                
                <div class="service">
                    <div class="service-icon">⚙️</div>
                    <h3>Technology Solutions</h3>
                    <p>Custom software development and IT solutions to streamline your business processes and improve efficiency.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="contact" id="contact">
        <div class="container">
            <div class="contact-content">
                <h2 class="section-title">Get In Touch</h2>
                <p class="section-subtitle">Ready to take your business to the next level? Contact us today for a free consultation.</p>
                
                <form class="contact-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="company">Company Name</label>
                        <input type="text" id="company" name="company">
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="submit-button">Send Message</button>
                </form>
            </div>
        </div>
    </section>
</body>
</html>`,
    cssContent: '',
    jsContent: '',
    isPublic: true
  }
]

async function seedTemplates() {
  console.log('Seeding templates...')
  
  // Clear existing templates first
  await prisma.template.deleteMany({})
  
  // Create new templates
  for (const template of templates) {
    await prisma.template.create({
      data: template,
    })
  }
  
  console.log('Templates seeded successfully!')
}

seedTemplates()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })