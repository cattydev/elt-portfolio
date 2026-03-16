'use client'

import { useState } from 'react'
import type { Profile } from '@/types'
import { Loader2, Save, User, Camera } from 'lucide-react'
import FileUploader from '@/components/ui/FileUploader'

interface Props {
  profile: Profile
  onUpdate: (updates: Partial<Profile>) => Promise<void>
}

export default function ProfileEditor({ profile, onUpdate }: Props) {
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    username: profile.username ?? '',
    bio: profile.bio ?? '',
    avatar_url: profile.avatar_url ?? '',
    cover_url: profile.cover_url ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingCover, setEditingCover] = useState(false)
  const [editingAvatar, setEditingAvatar] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

      {/* Cover photo section */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-br from-indigo-100 to-purple-100 w-full">
          {form.cover_url && (
            <img src={form.cover_url} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>
        <button
          onClick={() => { setEditingCover(v => !v); setEditingAvatar(false) }}
          className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
        >
          <Camera className="w-3.5 h-3.5" />
          {form.cover_url ? 'Change Cover' : 'Add Cover'}
        </button>
      </div>

      {/* Cover uploader (conditional) */}
      {editingCover && (
        <div className="px-4 pt-3 pb-1 bg-indigo-50 border-b border-indigo-100">
          <FileUploader
            userId={profile.id}
            folder="cover"
            type="image"
            currentUrl={form.cover_url}
            onUpload={url => { setForm(f => ({ ...f, cover_url: url })); setEditingCover(false) }}
            label="Upload Cover Photo"
          />
        </div>
      )}

      {/* Avatar section */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-100 overflow-hidden shadow">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-7 h-7 text-indigo-300" />
              </div>
            )}
          </div>
          <button
            onClick={() => { setEditingAvatar(v => !v); setEditingCover(false) }}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-sm transition-colors"
          >
            <Camera className="w-3 h-3 text-white" />
          </button>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{form.full_name || 'Your Name'}</p>
          <p className="text-xs text-gray-400">{form.username ? `@${form.username}` : 'Set a username below'}</p>
        </div>
      </div>

      {/* Avatar uploader (conditional) */}
      {editingAvatar && (
        <div className="px-4 pb-2 bg-indigo-50 border-b border-indigo-100">
          <FileUploader
            userId={profile.id}
            folder="avatar"
            type="image"
            currentUrl={form.avatar_url}
            onUpload={url => { setForm(f => ({ ...f, avatar_url: url })); setEditingAvatar(false) }}
            label="Upload Profile Photo"
          />
        </div>
      )}

      {/* Form fields */}
      <div className="px-4 pb-4 pt-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
          <input
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ada Yılmaz"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Username <span className="text-gray-400 font-normal">(public URL)</span>
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="px-2.5 py-2.5 bg-gray-50 text-gray-400 text-xs border-r border-gray-200 whitespace-nowrap">
              site.com/
            </span>
            <input
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
              className="flex-1 px-2.5 py-2.5 text-sm focus:outline-none"
              placeholder="adayilmaz"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Short Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="ELT student passionate about communicative language teaching…"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white text-sm font-medium py-3 rounded-xl transition-colors"
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
            : saved
            ? '✓ Saved!'
            : <><Save className="w-4 h-4" />Save Profile</>}
        </button>
      </div>
    </div>
  )
}
