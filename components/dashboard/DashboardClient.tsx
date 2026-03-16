'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, PortfolioSection, SectionType, Theme } from '@/types'
import { SECTION_LABELS, SECTION_ICONS } from '@/types'
import SectionEditor from './SectionEditor'
import SectionPicker from './SectionPicker'
import ThemeSelector from './ThemeSelector'
import ProfileEditor from './ProfileEditor'
import {
  BookOpen, Eye, LogOut, Plus, Trash2, EyeOff,
  ExternalLink, ArrowLeft, Layers, User, Palette, GripVertical
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

  // Drag state — refs avoid stale closures in touch listeners
  const dragId = useRef<string | null>(null)
  const dragOverId = useRef<string | null>(null)
  const [dragVisual, setDragVisual] = useState<{ dragging: string | null; over: string | null }>({
    dragging: null, over: null,
  })

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
      setEditingSection(prev => prev?.id === id ? { ...prev, data } : prev)
    }
    setSaving(false)
  }, [supabase])

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

  // Reorder by drag: move sourceId to position of targetId
  const reorderSections = useCallback(async (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return
    setSections(prev => {
      const next = [...prev]
      const from = next.findIndex(s => s.id === sourceId)
      const to = next.findIndex(s => s.id === targetId)
      if (from === -1 || to === -1) return prev
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      next.forEach((s, i) => { s.position = i })
      // Persist in background
      Promise.all(next.map(s =>
        supabase.from('portfolio_sections').update({ position: s.position }).eq('id', s.id)
      ))
      return next
    })
  }, [supabase])

  // ── Desktop HTML5 drag ──────────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, id: string) => {
    dragId.current = id
    setDragVisual({ dragging: id, over: null })
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverId.current !== id) {
      dragOverId.current = id
      setDragVisual(v => ({ ...v, over: id }))
    }
  }

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const src = dragId.current
    if (src) reorderSections(src, targetId)
    dragId.current = null
    dragOverId.current = null
    setDragVisual({ dragging: null, over: null })
  }

  const onDragEnd = () => {
    dragId.current = null
    dragOverId.current = null
    setDragVisual({ dragging: null, over: null })
  }

  // ── Mobile touch drag ───────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent, id: string) => {
    // Only start drag from the grip handle (first child)
    dragId.current = id
    setDragVisual({ dragging: id, over: null })

    const onMove = (ev: TouchEvent) => {
      ev.preventDefault()
      const touch = ev.touches[0]
      // Find which section row is under the finger
      let el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
      while (el && !el.dataset.sectionId) el = el.parentElement as HTMLElement | null
      const overId = el?.dataset.sectionId ?? null
      if (overId !== dragOverId.current) {
        dragOverId.current = overId
        setDragVisual(v => ({ ...v, over: overId }))
      }
    }

    const onEnd = () => {
      const src = dragId.current
      const tgt = dragOverId.current
      if (src && tgt && src !== tgt) reorderSections(src, tgt)
      dragId.current = null
      dragOverId.current = null
      setDragVisual({ dragging: null, over: null })
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }

    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd, { once: true })
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

  const updateTheme = async (theme: Theme) => { await updateProfile({ theme }) }
  const openSection = (section: PortfolioSection) => setEditingSection(section)
  const closeEditor = () => setEditingSection(null)
  const showEditorMobile = !!editingSection

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {showEditorMobile ? (
            <button onClick={closeEditor} className="flex items-center gap-2 text-gray-600 font-medium lg:hidden">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              ELT Portfolio
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
            {saving && <span className="text-xs text-gray-400 animate-pulse hidden sm:inline">Saving…</span>}
            {publicUrl && (
              <Link href={publicUrl} target="_blank"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full">

        {/* Mobile: full-screen editor */}
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

        {/* Layout */}
        <div className={`flex flex-col lg:flex-row gap-0 lg:gap-6 lg:px-4 lg:py-6 ${showEditorMobile ? 'hidden lg:flex' : 'flex'}`}>

          <aside className="w-full lg:w-72 lg:flex-shrink-0 flex flex-col">

            {/* Tab bar */}
            <div className="bg-white border-b lg:border border-gray-100 lg:rounded-xl p-1 flex gap-1 sticky top-14 z-40 lg:static lg:z-auto lg:mb-4">
              {([
                ['sections', 'Sections', <Layers key="s" className="w-4 h-4" />],
                ['profile',  'Profile',  <User    key="p" className="w-4 h-4" />],
                ['theme',    'Theme',    <Palette key="t" className="w-4 h-4" />],
              ] as [Panel, string, React.ReactNode][]).map(([key, label, icon]) => (
                <button key={key} onClick={() => setPanel(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 lg:py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    panel === key ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {icon}<span>{label}</span>
                </button>
              ))}
            </div>

            {/* Sections list */}
            {panel === 'sections' && (
              <div className="flex-1">
                <div className="bg-white lg:rounded-xl border-0 lg:border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800 text-sm">Portfolio Sections</h2>
                    <button onClick={() => setShowPicker(true)}
                      className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 px-3 py-1.5 rounded-lg transition-colors">
                      <Plus className="w-3.5 h-3.5" />Add
                    </button>
                  </div>

                  {sections.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      <p className="text-2xl mb-2">📋</p>
                      <p>No sections yet.</p>
                      <button onClick={() => setShowPicker(true)}
                        className="mt-3 text-indigo-600 hover:underline text-sm font-medium">
                        Add your first section →
                      </button>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {sections.map(section => (
                        <li
                          key={section.id}
                          data-section-id={section.id}
                          draggable
                          onDragStart={e => onDragStart(e, section.id)}
                          onDragOver={e => onDragOver(e, section.id)}
                          onDrop={e => onDrop(e, section.id)}
                          onDragEnd={onDragEnd}
                          className={`flex items-center gap-2 px-3 py-3 transition-all select-none
                            ${editingSection?.id === section.id ? 'bg-indigo-50' : 'hover:bg-gray-50 active:bg-gray-100'}
                            ${dragVisual.dragging === section.id ? 'opacity-40 scale-[0.98]' : ''}
                            ${dragVisual.over === section.id && dragVisual.dragging !== section.id
                              ? 'border-t-2 border-indigo-400' : ''}
                          `}
                        >
                          {/* Drag handle — touch drag starts here */}
                          <span
                            className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-gray-300 hover:text-gray-500 transition-colors p-0.5"
                            onTouchStart={e => { e.stopPropagation(); onTouchStart(e, section.id) }}
                            aria-label="Drag to reorder"
                          >
                            <GripVertical className="w-4 h-4" />
                          </span>

                          {/* Section row — click to edit */}
                          <span
                            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                            onClick={() => openSection(section)}
                          >
                            <span className="text-base flex-shrink-0">{SECTION_ICONS[section.type]}</span>
                            <span className="flex-1 text-sm text-gray-700 truncate">{section.title}</span>
                          </span>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button
                              onClick={e => { e.stopPropagation(); toggleVisibility(section.id, !section.visible) }}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 active:text-indigo-600 rounded-lg transition-colors"
                              aria-label={section.visible ? 'Hide' : 'Show'}
                            >
                              {section.visible
                                ? <Eye className="w-4 h-4" />
                                : <EyeOff className="w-4 h-4 text-gray-300" />}
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); deleteSection(section.id) }}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 rounded-lg transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <p className="hidden lg:block text-xs text-center text-gray-400 mt-3">
                  Drag ☰ to reorder · tap a section to edit
                </p>
              </div>
            )}

            {panel === 'profile' && profile && (
              <div className="px-4 py-4 lg:px-0 lg:py-0">
                <ProfileEditor profile={profile} onUpdate={updateProfile} />
              </div>
            )}

            {panel === 'theme' && profile && (
              <div className="px-4 py-4 lg:px-0 lg:py-0">
                <ThemeSelector currentTheme={profile.theme} onSelect={updateTheme} />
              </div>
            )}
          </aside>

          {/* Desktop editor */}
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
                  <button onClick={() => setShowPicker(true)}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />Add Section
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

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
