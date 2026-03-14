'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import FileUploader from '@/components/ui/FileUploader'
import { generateId } from '@/lib/utils'
import type { LessonPlansData, LessonPlanItem } from '@/types'

const blank = (): LessonPlanItem => ({
  id: generateId(), title: '', level: '', topic: '', duration: '', file_url: '', description: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function LessonPlansEditor({ data, onSave, userId }: Props) {
  const d = data as Partial<LessonPlansData>
  const [items, setItems] = useState<LessonPlanItem[]>(d.items ?? [])

  const update = (id: string, key: keyof LessonPlanItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Lesson Title</Label>
              <Input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Present Perfect with Real Contexts" />
            </div>
            <div>
              <Label>Level (CEFR)</Label>
              <Select value={item.level} onChange={e => update(item.id, 'level', e.target.value)}>
                <option value="">Select…</option>
                {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l} value={l}>{l}</option>)}
              </Select>
            </div>
            <div>
              <Label>Duration</Label>
              <Input value={item.duration} onChange={e => update(item.id, 'duration', e.target.value)} placeholder="40 min" />
            </div>
            <div className="col-span-2">
              <Label>Topic / Skills Focus</Label>
              <Input value={item.topic} onChange={e => update(item.id, 'topic', e.target.value)} placeholder="Grammar – Reading – Speaking" />
            </div>
            <div className="col-span-2">
              <Label>Upload Lesson Plan (PDF / Doc)</Label>
              <FileUploader
                userId={userId}
                folder="lesson-plans"
                type="pdf"
                accept="application/pdf,.doc,.docx"
                currentUrl={item.file_url}
                onUpload={url => update(item.id, 'file_url', url)}
                label="Upload PDF or Word file"
                preview
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={item.description ?? ''} onChange={e => update(item.id, 'description', e.target.value)} rows={2} placeholder="Brief overview of the lesson…" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Lesson Plan" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
