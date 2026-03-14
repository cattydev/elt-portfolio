import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicPortfolio from '@/components/portfolio/PublicPortfolio'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio')
    .eq('username', username)
    .single()

  if (!profile) return { title: 'Portfolio Not Found' }
  return {
    title: `${profile.full_name ?? username} — ELT Portfolio`,
    description: profile.bio ?? `${username}'s ELT Portfolio`,
  }
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: sections } = await supabase
    .from('portfolio_sections')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('visible', true)
    .order('position')

  return <PublicPortfolio profile={profile} sections={sections ?? []} />
}
