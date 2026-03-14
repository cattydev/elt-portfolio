import type { Profile, PortfolioSection } from '@/types'
import { SECTION_ICONS } from '@/types'
import SectionRenderer from '../SectionRenderer'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function AcademicTheme({ profile, sections }: { profile: Profile; sections: PortfolioSection[] }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 text-sm hover:text-slate-200 transition-colors">
            <BookOpen className="w-4 h-4" />
            ELT Portfolio
          </Link>
        </div>
      </div>

      {/* Cover photo */}
      {profile.cover_url && (
        <div className="w-full h-48 overflow-hidden">
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover opacity-60" />
        </div>
      )}

      {/* Hero */}
      <div className="bg-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-start gap-6">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? ''}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 flex-shrink-0 shadow-lg"
              />
            )}
            <div className="flex-1">
              <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
                English Language Teaching
              </div>
              <h1 className="text-5xl font-bold text-white">{profile.full_name ?? profile.username}</h1>
              {profile.bio && (
                <p className="text-slate-300 mt-4 max-w-xl leading-relaxed text-lg">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      {sections.length > 0 && (
        <nav className="bg-slate-700 border-b border-slate-600 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 overflow-x-auto">
            <div className="flex gap-1 py-1">
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{SECTION_ICONS[s.type]}</span>
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Sections */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {sections.map(section => (
          <section key={section.id} id={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 font-bold">
                {SECTION_ICONS[section.type]}
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="text-slate-300 [&_.text-gray-600]:text-slate-300 [&_.text-gray-500]:text-slate-400 [&_.text-gray-400]:text-slate-500 [&_.text-gray-800]:text-white [&_.text-gray-700]:text-slate-200 [&_.border-gray-100]:border-slate-700 [&_.border-gray-200]:border-slate-600 [&_.bg-gray-50]:bg-slate-700 [&_.bg-gray-100]:bg-slate-700 [&_.border-gray-200]:border-slate-600">
                <SectionRenderer section={section} accent="text-amber-400" />
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-slate-700 py-8 text-center text-xs text-slate-500">
        Built with ELT Portfolio
      </footer>
    </div>
  )
}
