'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea } from './shared'
import type { AboutData } from '@/types'

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function AboutEditor({ data, onSave, userId: _userId }: Props) {
  const d = data as Partial<AboutData>
  const [form, setForm] = useState<AboutData>({
    bio: d.bio ?? '',
    location: d.location ?? '',
    email: d.email ?? '',
    linkedin: d.linkedin ?? '',
    website: d.website ?? '',
  })

  const set = (key: keyof AboutData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-4">
      <div>
        <Label>Bio / Introduction</Label>
        <Textarea value={form.bio} onChange={set('bio')} rows={5} placeholder="I am an ELT student at…" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Location</Label>
          <Input value={form.location} onChange={set('location')} placeholder="Ankara, Turkey" />
        </div>
        <div>
          <Label>Contact Email</Label>
          <Input value={form.email} onChange={set('email')} placeholder="you@example.com" type="email" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>LinkedIn URL</Label>
          <Input value={form.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/…" />
        </div>
        <div>
          <Label>Personal Website</Label>
          <Input value={form.website} onChange={set('website')} placeholder="https://…" />
        </div>
      </div>
      <div className="pt-2 flex justify-end">
        <SaveButton onSave={() => onSave(form as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
