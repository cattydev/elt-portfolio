'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Card, AddButton } from './shared'
import { generateId } from '@/lib/utils'
import type { EducationData, EducationItem } from '@/types'

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

const blank = (): EducationItem => ({
  id: generateId(), institution: '', degree: '', field: '',
  start_year: '', end_year: '', description: '',
})

export default function EducationEditor({ data, onSave }: Props) {
  const d = data as Partial<EducationData>
  const [items, setItems] = useState<EducationItem[]>(d.items ?? [])

  const update = (id: string, key: keyof EducationItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Institution</Label>
              <Input value={item.institution} onChange={e => update(item.id, 'institution', e.target.value)} placeholder="Ankara University" />
            </div>
            <div>
              <Label>Degree</Label>
              <Input value={item.degree} onChange={e => update(item.id, 'degree', e.target.value)} placeholder="Bachelor's" />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input value={item.field} onChange={e => update(item.id, 'field', e.target.value)} placeholder="English Language Teaching" />
            </div>
            <div>
              <Label>Start Year</Label>
              <Input value={item.start_year} onChange={e => update(item.id, 'start_year', e.target.value)} placeholder="2020" />
            </div>
            <div>
              <Label>End Year</Label>
              <Input value={item.end_year} onChange={e => update(item.id, 'end_year', e.target.value)} placeholder="2024 (or Present)" />
            </div>
            <div className="col-span-2">
              <Label>Notes (optional)</Label>
              <Input value={item.description ?? ''} onChange={e => update(item.id, 'description', e.target.value)} placeholder="GPA, honors, relevant courses…" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Education" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
