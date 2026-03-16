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
  BookOpen, Eye, LogOut, Plus, Trash2, EyeOff,
  ExternalLink, ChevronUp, ChevronDown, ArrowLeft, Layers, User, Palette
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

  const openSection = (section: PortfolioSection) => {
    setEditingSection(section)
  }

  const closeEditor = () => setEditingSection(null)

  // Mobile: show editor as full-screen overlay when a section is selected
  const showEditorMobile = !!editingSection

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Mobile: show back button when editing */}
          {showEditorMobile ? (
            <button
              onClick={closeEditor}
              className="flex items-center gap-2 text-gray-600 font-medium lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="sm:inline">ELT Portfolio</span>
            </Link>
          )}

          {showEditorMobile && (
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px] lg:hidden">
              {editingSection ? `${SECTION_ICONS[editingSection.type]} ${editingSection.title}` : ''}
            </span>
          )}

          {!showEditorMobile && (
            <Link href="/" className="hidden lg:flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <BookOpen className="w-6 h-6" />
              ELT Portfolio
            </Link>
          )}

          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-gray-400 animate-pulse hidden sm:inline">Saving…</span>
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

      {/* Desktop: two-column layout | Mobile: single column */}
      <div className="flex-1 max-w-7xl mx-auto w-full">

        {/* Mobile: Editor overlay */}
        {showEditorMobile && (
          <div className="lg:hidden min-h-[calc(100vh-3.5rem)] p-4">
            <SectionEditor
              section={editingSection!}
              userId={profile?.id ?? ''}
              onUpdate={updateSectionData}
              onClose={closeEditor}
            />
          </div>
        )}

        {/* Main layout (always visible on desktop, hidden on mobile when editor is open) */}
        <div className={`flex flex-col lg:flex-row gap-0 lg:gap-6 lg:px-4 lg:py-6 ${showEditorMobile ? 'hidden lg:flex' : 'flex'}`}>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 lg:flex-shrink-0 flex flex-col">

            {/* Tab navigation */}
            <div className="bg-white border-b lg:border border-gray-100 lg:rounded-xl p-1 flex gap-1 sticky top-14 z-40 lg:static lg:z-auto lg:mb-4">
              {([
                ['sections', 'Sections', <Layers key="s" className="w-4 h-4" />],
                ['profile', 'Profile', <User key="p" className="w-4 h-4" />],
                ['theme', 'Theme', <Palette key="t" className="w-4 h-4" />],
              ] as [Panel, string, React.ReactNode][]).map(([key, label, icon]) => (
                <button
                  key={key}
                  onClick={() => setPanel(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 lg:py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    panel === key
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Sections panel */}
            {panel === 'sections' && (
              <div className="flex-1">
                <div className="bg-white lg:rounded-xl border-0 lg:border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800 text-sm">Portfolio Sections</h2>
                    <button
                      onClick={() => setShowPicker(true)}
                      className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>

                  {sections.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      <p className="text-2xl mb-2">📋</p>
                      <p>No sections yet.</p>
                      <button
                        onClick={() => setShowPicker(true)}
                        className="mt-3 text-indigo-600 hover:underline text-sm font-medium"
                      >
                        Add your first section →
                      </button>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {sections.map((section, idx) => (
                        <li
                          key={section.id}
                          className={`flex items-center gap-2 px-3 py-3 cursor-pointer transition-colors ${
                            editingSection?.id === section.id
                              ? 'bg-indigo-50'
                              : 'hover:bg-gray-50 active:bg-gray-100'
                          }`}
                          onClick={() => openSection(section)}
                        >
                          {/* Reorder buttons — always visible, touch-friendly */}
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <button
                              onClick={e => { e.stopPropagation(); moveSection(section.id, 'up') }}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 active:text-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed rounded transition-colors"
                              aria-label="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); moveSection(section.id, 'down') }}
                              disabled={idx === sections.length - 1}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 active:text-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed rounded transition-colors"
                              aria-label="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-base flex-shrink-0">{SECTION_ICONS[section.type]}</span>
                          <span className="flex-1 text-sm text-gray-700 truncate">{section.title}</span>

                          {/* Visibility + delete */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={e => { e.stopPropagation(); toggleVisibility(section.id, !section.visible) }}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 active:text-indigo-600 rounded-lg transition-colors"
                              aria-label={section.visible ? 'Hide section' : 'Show section'}
                            >
                              {section.visible
                                ? <Eye className="w-4 h-4" />
                                : <EyeOff className="w-4 h-4 text-gray-300" />}
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); deleteSection(section.id) }}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 rounded-lg transition-colors"
                              aria-label="Delete section"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Desktop: tap to edit hint */}
                <p className="hidden lg:block text-xs text-center text-gray-400 mt-3">
                  Tap a section to edit its content
                </p>
              </div>
            )}

            {/* Profile panel */}
            {panel === 'profile' && profile && (
              <div className="px-4 py-4 lg:px-0 lg:py-0">
                <ProfileEditor profile={profile} onUpdate={updateProfile} />
              </div>
            )}

            {/* Theme panel */}
            {panel === 'theme' && profile && (
              <div className="px-4 py-4 lg:px-0 lg:py-0">
                <ThemeSelector currentTheme={profile.theme} onSelect={updateTheme} />
              </div>
            )}
          </aside>

          {/* Desktop main editor area */}
          <main className="hidden lg:flex flex-1 min-w-0">
            {editingSection ? (
              <div className="w-full">
                <SectionEditor
                  section={editingSection}
                  userId={profile?.id ?? ''}
                  onUpdate={updateSectionData}
                  onClose={closeEditor}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 w-full flex items-center justify-center text-center p-12">
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
