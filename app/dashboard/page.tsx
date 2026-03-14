import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: sections } = await supabase
    .from('portfolio_sections')
    .select('*')
    .eq('profile_id', user.id)
    .order('position')

  return (
    <DashboardClient
      initialProfile={profile}
      initialSections={sections ?? []}
    />
  )
}
