'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Card, AddButton } from './shared'
import { generateId } from '@/lib/utils'
import type { ReflectionsData, ReflectionItem } from '@/types'

const blank = (): ReflectionItem => ({
  id: generateId(), title: '', date: new Date().toISOString().split('T')[0], content: '', tags: [],
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function ReflectionsEditor({ data, onSave }: Props) {
  const d = data as Partial<ReflectionsData>
  const [items, setItems] = useState<ReflectionItem[]>(d.items ?? [])

  const update = (id: string, key: keyof ReflectionItem, value: unknown) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  const updateTags = (id: string, tagStr: string) =>
    update(id, 'tags', tagStr.split(',').map(t => t.trim()).filter(Boolean))

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Reflections are personal written thoughts on your teaching practice — a key part of an ELT portfolio.</p>
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Title</Label>
                <Input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Reflection on my first lesson" />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={item.date} onChange={e => update(item.id, 'date', e.target.value)} type="date" />
              </div>
            </div>
            <div>
              <Label>Your Reflection</Label>
              <Textarea
                value={item.content}
                onChange={e => update(item.id, 'content', e.target.value)}
                rows={6}
                placeholder="Today I taught a lesson on... I noticed that... What I would do differently is..."
              />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={(item.tags ?? []).join(', ')}
                onChange={e => updateTags(item.id, e.target.value)}
                placeholder="classroom management, speaking, feedback"
              />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Reflection" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
