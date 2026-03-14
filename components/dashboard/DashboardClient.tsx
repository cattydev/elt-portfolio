'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, PortfolioSection, SectionType, Theme } from '@/types'
import { SECTION_LABELS, SECTION_ICONS, THEME_LABELS } from '@/types'
import SectionEditor from './SectionEditor'
import SectionPicker from './SectionPicker'
import ThemeSelector from './ThemeSelector'
import ProfileEditor from './ProfileEditor'
import {
  BookOpen, Eye, LogOut, Settings, Plus, GripVertical,
  Trash2, EyeOff, ChevronRight, ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  initialProfile: Profile | null
  initialSections: PortfolioSection[]
}

type Panel = 'sections' | 'profile' | 'theme'

export default function DashboardClient({ initialProfile, initialSections }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [sections, setSections] = useState<PortfolioSection[]>(initialSections)
  const [editingSection, setEditingSection] = useState<PortfolioSection | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [panel, setPanel] = useState<Panel>('sections')
  const [saving, setSaving] = useState(false)

  const publicUrl = profile?.username ? `/${profile.username}` : null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const addSection = async (type: SectionType) => {
    if (!profile) return
    setSaving(true)
    const newSection = {
      profile_id: profile.id,
      type,
      title: SECTION_LABELS[type],
      position: sections.length,
      visible: true,
      data: {},
    }
    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert(newSection)
      .select()
      .single()

    if (!error && data) {
      setSections(prev => [...prev, data])
      setEditingSection(data)
    }
    setSaving(false)
    setShowPicker(false)
  }

  const updateSectionData = useCallback(async (id: string, data: Record<string, unknown>) => {
    setSaving(true)
    const { error } = await supabase
      .from('portfolio_sections')
      .update({ data, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, data } : s))
      if (editingSection?.id === id) setEditingSection(prev => prev ? { ...prev, data } : null)
    }
    setSaving(false)
  }, [supabase, editingSection])

  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from('portfolio_sections').update({ visible }).eq('id', id)
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible } : s))
  }

  const deleteSection = async (id: string) => {
    if (!confirm('Delete this section?')) return
    await supabase.from('portfolio_sections').delete().eq('id', id)
    setSections(prev => prev.filter(s => s.id !== id))
    if (editingSection?.id === id) setEditingSection(null)
  }

  const moveSection = async (id: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === sections.length - 1) return

    const newSections = [...sections]
    const swap = direction === 'up' ? idx - 1 : idx + 1
    ;[newSections[idx], newSections[swap]] = [newSections[swap], newSections[idx]]
    newSections.forEach((s, i) => { s.position = i })
    setSections(newSections)

    await Promise.all(
      newSections.map(s =>
        supabase.from('portfolio_sections').update({ position: s.position }).eq('id', s.id)
      )
    )
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    if (!error) setProfile(prev => prev ? { ...prev, ...updates } : null)
    setSaving(false)
  }

  const updateTheme = async (theme: Theme) => {
    await updateProfile({ theme })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <BookOpen className="w-6 h-6" />
            ELT Portfolio
          </Link>
          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-gray-400 animate-pulse">Saving…</span>
            )}
            {publicUrl && (
              <Link
                href={publicUrl}
                target="_blank"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 space-y-4">
          {/* Nav tabs */}
          <div className="bg-white rounded-xl border border-gray-100 p-1 flex gap-1">
            {([['sections', 'Sections'], ['profile', 'Profile'], ['theme', 'Theme']] as [Panel, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPanel(key)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  panel === key
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sections panel */}
          {panel === 'sections' && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Portfolio Sections</h2>
                <button
                  onClick={() => setShowPicker(true)}
                  className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  <p>No sections yet.</p>
                  <button
                    onClick={() => setShowPicker(true)}
                    className="mt-2 text-indigo-600 hover:underline text-xs"
                  >
                    Add your first section
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {sections.map((section, idx) => (
                    <li
                      key={section.id}
                      className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                        editingSection?.id === section.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => setEditingSection(section)}
                    >
                      <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      <span className="text-base">{SECTION_ICONS[section.type]}</span>
                      <span className="flex-1 text-sm text-gray-700 truncate">{section.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); moveSection(section.id, 'up') }}
                          disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-0.5"
                        >↑</button>
                        <button
                          onClick={e => { e.stopPropagation(); moveSection(section.id, 'down') }}
                          disabled={idx === sections.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-0.5"
                        >↓</button>
                        <button
                          onClick={e => { e.stopPropagation(); toggleVisibility(section.id, !section.visible) }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {section.visible
                            ? <Eye className="w-3.5 h-3.5" />
                            : <EyeOff className="w-3.5 h-3.5 text-gray-300" />}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); deleteSection(section.id) }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-gray-300 flex-shrink-0 transition-transform ${editingSection?.id === section.id ? 'rotate-90 text-indigo-400' : ''}`} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Profile panel */}
          {panel === 'profile' && profile && (
            <ProfileEditor profile={profile} onUpdate={updateProfile} />
          )}

          {/* Theme panel */}
          {panel === 'theme' && profile && (
            <ThemeSelector currentTheme={profile.theme} onSelect={updateTheme} />
          )}
        </aside>

        {/* Main editor area */}
        <main className="flex-1 min-w-0">
          {editingSection ? (
            <SectionEditor
              section={editingSection}
              userId={profile?.id ?? ''}
              onUpdate={updateSectionData}
              onClose={() => setEditingSection(null)}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 h-full flex items-center justify-center text-center p-12">
              <div>
                <div className="text-5xl mb-4">✏️</div>
                <h3 className="text-lg font-semibold text-gray-700">Select a section to edit</h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs">
                  Choose a section from the left panel, or add a new one to get started.
                </p>
                <button
                  onClick={() => setShowPicker(true)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Section picker modal */}
      {showPicker && (
        <SectionPicker
          existingTypes={sections.map(s => s.type)}
          onSelect={addSection}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
