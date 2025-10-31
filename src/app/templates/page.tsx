import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import TemplateGallery from '@/components/templates/template-gallery'

export default async function TemplatesPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <TemplateGallery user={session.user} />
}