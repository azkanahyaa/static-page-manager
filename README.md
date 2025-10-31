# 🚀 StaticManager

**The Professional Static Website Management Platform**

Transform your static site development workflow with enterprise-grade tools, collaborative editing, and seamless deployment - all in one powerful platform.

## ✨ Why StaticManager?

**Bridge the Gap Between Simple and Complex**
- Too simple: Basic HTML editors lack professional features
- Too complex: Traditional CMS platforms are overkill for static sites
- **Just right**: StaticManager delivers enterprise features with static site simplicity

**🎯 Perfect For:**
- **Web Developers** building client websites with team collaboration
- **Design Agencies** managing multiple static site projects
- **Content Creators** who need powerful editing tools without server complexity
- **Enterprises** requiring secure, scalable static site management

## 🌟 Key Features

### 🔥 Professional Code Editor
- **Monaco Editor** with syntax highlighting and auto-completion
- Multi-file editing with tabs and project explorer
- Real-time error detection and IntelliSense
- Live preview with responsive breakpoint testing

### 👥 Team Collaboration
- **Role-based access control** (Admin, Project Owner, Editor, Viewer)
- Real-time collaborative editing
- Project invitation system with granular permissions
- Activity tracking and team notifications

### 🎨 Visual Builder & Templates
- Drag-and-drop visual builder for rapid prototyping
- Curated template gallery with professional designs
- Custom template creation and sharing
- Component library for consistent design systems

### 📁 Smart Asset Management
- Drag-and-drop file uploads with batch processing
- Automatic image optimization and WebP conversion
- Organized folder structure with tagging system
- CDN integration for global asset delivery

### 🚀 One-Click Deployment
- Multiple deployment targets (Vercel, Netlify, custom servers)
- Build management with detailed logs
- Version control with rollback functionality
- Custom domain configuration with SSL

### 📊 Analytics & Performance
- Built-in performance monitoring with Lighthouse scores
- Visitor analytics and behavior tracking
- SEO insights and optimization suggestions
- Real-time deployment status monitoring

## 🛠️ Technology Stack

**Frontend:**
- **Next.js 15** with React 19 and TypeScript
- **Tailwind CSS** for responsive design
- **Monaco Editor** for professional code editing
- **Zustand** for state management
- **React Hook Form** with Zod validation

**Backend:**
- **Next.js API Routes** with serverless architecture
- **Prisma ORM** with SQLite database
- **NextAuth.js** for secure authentication
- **bcryptjs** for password hashing

**Development Tools:**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prisma Studio** for database management
- **Hot reload** for instant development feedback

## 📁 Project Structure

```
StaticManager/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API endpoints
│   │   ├── 📁 auth/              # Authentication pages
│   │   ├── 📁 dashboard/         # Main dashboard
│   │   ├── 📁 projects/          # Project management
│   │   ├── 📁 templates/         # Template gallery
│   │   └── 📁 preview/           # Site preview
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 editor/            # Code editor components
│   │   ├── 📁 dashboard/         # Dashboard widgets
│   │   ├── 📁 assets/            # Asset management
│   │   └── 📁 ui/                # Base UI components
│   ├── 📁 lib/                   # Utility libraries
│   └── 📁 types/                 # TypeScript definitions
├── 📁 prisma/                    # Database schema & migrations
├── 📁 public/                    # Static assets
└── 📁 scripts/                   # Build and utility scripts
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn
- **Git** for version control

### 1. Clone & Install
```bash
git clone <repository-url>
cd StaticManager
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# DATABASE_URL, NEXTAUTH_SECRET, etc.
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see your StaticManager instance!

## 🔧 Development Guide

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

### Database Management
```bash
# View/edit data in browser
npm run db:studio

# Reset database (development only)
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Environment Variables
Key configuration options in `.env`:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# File Upload
MAX_FILE_SIZE=10485760          # 10MB limit
UPLOAD_DIR="./public/uploads"   # Upload directory

# App Configuration
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

### Adding New Features
1. **API Routes**: Add to `src/app/api/`
2. **Pages**: Add to `src/app/` following App Router conventions
3. **Components**: Add to `src/components/` with proper categorization
4. **Database**: Update `prisma/schema.prisma` and run migrations

### Code Style
- **TypeScript** for all new code
- **Tailwind CSS** for styling
- **ESLint** configuration enforced
- **Prisma** for database operations
- **Zod** for runtime validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Ready to revolutionize your static site workflow?** 🚀

Get started with StaticManager today and experience the future of static website management!