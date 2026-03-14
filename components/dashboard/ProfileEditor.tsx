'use client'

import { useState } from 'react'
import type { Profile } from '@/types'
import { Loader2, Save, User } from 'lucide-react'
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

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Cover photo */}
      <div className="relative h-24 bg-gradient-to-br from-indigo-100 to-purple-100 group cursor-pointer">
        {form.cover_url ? (
          <img src={form.cover_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs select-none">
            Click to add cover photo
          </div>
        )}
        {/* Overlay uploader */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FileUploader
              userId={profile.id}
              folder="cover"
              type="image"
              onUpload={url => setForm(f => ({ ...f, cover_url: url }))}
              label="Upload Cover"
              className="w-36"
            />
          </div>
        </div>
      </div>

      {/* Avatar row */}
      <div className="px-4 -mt-7 mb-3 flex items-end gap-3">
        <div className="relative w-14 h-14 rounded-full border-4 border-white bg-indigo-100 overflow-hidden shadow flex-shrink-0">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-300" />
            </div>
          )}
        </div>
        <div className="flex-1 mb-0.5">
          <FileUploader
            userId={profile.id}
            folder="avatar"
            type="image"
            onUpload={url => setForm(f => ({ ...f, avatar_url: url }))}
            label="Upload Photo"
          />
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
          <input
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ada Yılmaz"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Username <span className="text-gray-400 font-normal">(public URL)</span>
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="px-2.5 py-2 bg-gray-50 text-gray-400 text-xs border-r border-gray-200 whitespace-nowrap">
              site.com/
            </span>
            <input
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
              className="flex-1 px-2.5 py-2 text-sm focus:outline-none"
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
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="ELT student passionate about communicative language teaching…"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
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
