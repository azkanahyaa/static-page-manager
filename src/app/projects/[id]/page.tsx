import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import ProjectEditor from '@/components/editor/project-editor'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const { id } = await params
  return <ProjectEditor projectId={id} session={session} />
}