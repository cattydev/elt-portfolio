import type { Profile, PortfolioSection } from '@/types'
import { SECTION_ICONS } from '@/types'
import SectionRenderer from '../SectionRenderer'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CreativeTheme({ profile, sections }: { profile: Profile; sections: PortfolioSection[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-500 text-sm hover:text-indigo-700 transition-colors">
            <BookOpen className="w-4 h-4" />
            ELT Portfolio
          </Link>
          {sections.length > 0 && (
            <nav className="hidden md:flex gap-1">
              {sections.slice(0, 5).map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  {s.title}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        {profile.cover_url ? (
          <div className="absolute inset-0">
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/75 to-pink-500/70" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-white">
          <div className="flex items-end gap-5">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? ''}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-xl flex-shrink-0"
              />
            )}
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-3">
                ✨ ELT Student Portfolio
              </div>
              <h1 className="text-5xl font-black tracking-tight">
                {profile.full_name ?? profile.username}
              </h1>
              {profile.bio && (
                <p className="mt-3 text-white/80 text-lg max-w-xl leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {sections.map((section, i) => (
          <section key={section.id} id={section.id}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm
                ${i % 3 === 0 ? 'bg-indigo-100' : i % 3 === 1 ? 'bg-purple-100' : 'bg-pink-100'}`}>
                {SECTION_ICONS[section.type]}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
            </div>
            <SectionRenderer section={section} accent="text-indigo-600" />
          </section>
        ))}
      </main>

      <footer className="py-8 text-center text-xs text-gray-400">
        Built with ELT Portfolio
      </footer>
    </div>
  )
}
