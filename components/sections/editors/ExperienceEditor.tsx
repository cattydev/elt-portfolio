'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import { generateId } from '@/lib/utils'
import type { ExperienceData, ExperienceItem } from '@/types'

const blank = (): ExperienceItem => ({
  id: generateId(), title: '', organization: '', type: 'internship',
  start_date: '', end_date: '', current: false, description: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function ExperienceEditor({ data, onSave }: Props) {
  const d = data as Partial<ExperienceData>
  const [items, setItems] = useState<ExperienceItem[]>(d.items ?? [])

  const update = (id: string, key: keyof ExperienceItem, value: unknown) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Job Title / Role</Label>
              <Input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Student Teacher" />
            </div>
            <div>
              <Label>Organization / School</Label>
              <Input value={item.organization} onChange={e => update(item.id, 'organization', e.target.value)} placeholder="Ankara Middle School" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={item.type} onChange={e => update(item.id, 'type', e.target.value)}>
                <option value="internship">Internship</option>
                <option value="volunteer">Volunteer</option>
                <option value="part_time">Part-time</option>
                <option value="full_time">Full-time</option>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input value={item.start_date} onChange={e => update(item.id, 'start_date', e.target.value)} placeholder="Sep 2023" />
            </div>
            <div>
              <Label>End Date</Label>
              <Input value={item.end_date ?? ''} onChange={e => update(item.id, 'end_date', e.target.value)} placeholder="Jun 2024" disabled={item.current} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${item.id}`}
                checked={item.current}
                onChange={e => update(item.id, 'current', e.target.checked)}
                className="rounded"
              />
              <label htmlFor={`current-${item.id}`} className="text-sm text-gray-600">Currently working here</label>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={item.description ?? ''} onChange={e => update(item.id, 'description', e.target.value)} rows={3} placeholder="Describe your responsibilities and achievements…" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Experience" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
