import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import ProjectSettings from '@/components/editor/project-settings'

interface ProjectEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectEditPage({ params }: ProjectEditPageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const { id } = await params
  return <ProjectSettings projectId={id} user={session.user} />
}