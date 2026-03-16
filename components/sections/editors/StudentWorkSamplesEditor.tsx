'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import FileUploader from '@/components/ui/FileUploader'
import { generateId } from '@/lib/utils'
import type { StudentWorkSamplesData, StudentWorkItem } from '@/types'

const blank = (): StudentWorkItem => ({
  id: generateId(), title: '', level: '', activity_type: '', description: '', file_url: '', image_url: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function StudentWorkSamplesEditor({ data, onSave, userId }: Props) {
  const d = data as Partial<StudentWorkSamplesData>
  const [items, setItems] = useState<StudentWorkItem[]>(d.items ?? [])

  const update = (id: string, key: keyof StudentWorkItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="space-y-3">
            <div>
              <Label>Sample Title</Label>
              <Input
                value={item.title}
                onChange={e => update(item.id, 'title', e.target.value)}
                placeholder="Story Writing Activity Outputs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Student Level (CEFR)</Label>
                <Select value={item.level} onChange={e => update(item.id, 'level', e.target.value)}>
                  <option value="">Select…</option>
                  {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>
              <div>
                <Label>Activity Type</Label>
                <Input
                  value={item.activity_type}
                  onChange={e => update(item.id, 'activity_type', e.target.value)}
                  placeholder="e.g. Writing, Speaking, Project"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={item.description ?? ''}
                onChange={e => update(item.id, 'description', e.target.value)}
                rows={2}
                placeholder="Brief context about the activity and what it demonstrates…"
              />
            </div>
            <div>
              <Label>Upload Student Work (PDF / Image)</Label>
              <FileUploader
                userId={userId}
                folder="student-work"
                type="any"
                accept="application/pdf,image/*"
                currentUrl={item.file_url}
                onUpload={url => update(item.id, 'file_url', url)}
                label="Upload File or Photo"
                preview
              />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Work Sample" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
