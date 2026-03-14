'use client'

import type { Profile, PortfolioSection, Theme } from '@/types'
import { SECTION_ICONS } from '@/types'
import MinimalTheme from './themes/MinimalTheme'
import AcademicTheme from './themes/AcademicTheme'
import CreativeTheme from './themes/CreativeTheme'

interface Props {
  profile: Profile
  sections: PortfolioSection[]
}

export default function PublicPortfolio({ profile, sections }: Props) {
  switch (profile.theme as Theme) {
    case 'academic': return <AcademicTheme profile={profile} sections={sections} />
    case 'creative': return <CreativeTheme profile={profile} sections={sections} />
    default: return <MinimalTheme profile={profile} sections={sections} />
  }
}
