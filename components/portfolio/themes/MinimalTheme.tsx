import type { Profile, PortfolioSection } from '@/types'
import { SECTION_ICONS } from '@/types'
import SectionRenderer from '../SectionRenderer'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function MinimalTheme({ profile, sections }: { profile: Profile; sections: PortfolioSection[] }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 text-sm hover:text-gray-600 transition-colors">
            <BookOpen className="w-4 h-4" />
            ELT Portfolio
          </Link>
        </div>
      </header>

      {/* Cover photo */}
      {profile.cover_url && (
        <div className="w-full h-52 overflow-hidden bg-gray-100">
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Hero */}
      <div className={`max-w-3xl mx-auto px-6 border-b border-gray-100 ${profile.cover_url ? 'pt-6 pb-10' : 'py-12'}`}>
        <div className="flex items-end gap-5">
          {profile.avatar_url && (
            <div className={`flex-shrink-0 ${profile.cover_url ? '-mt-16' : ''}`}>
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? ''}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-gray-900">{profile.full_name ?? profile.username}</h1>
            <p className="text-gray-500 mt-1 text-lg">ELT Student</p>
          </div>
        </div>
        {profile.bio && <p className="text-gray-600 mt-5 max-w-xl leading-relaxed">{profile.bio}</p>}
      </div>

      {/* Sections */}
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-14">
        {sections.map(section => (
          <section key={section.id}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{SECTION_ICONS[section.type]}</span>
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            </div>
            <SectionRenderer section={section} accent="text-indigo-600" />
          </section>
        ))}
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-300">
        Built with ELT Portfolio
      </footer>
    </div>
  )
}
