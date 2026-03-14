'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import FileUploader from '@/components/ui/FileUploader'
import { generateId } from '@/lib/utils'
import type { AcademicWorksData, AcademicWorkItem } from '@/types'

const blank = (): AcademicWorkItem => ({
  id: generateId(), title: '', type: 'paper', date: '', description: '', file_url: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function AcademicWorksEditor({ data, onSave, userId }: Props) {
  const d = data as Partial<AcademicWorksData>
  const [items, setItems] = useState<AcademicWorkItem[]>(d.items ?? [])

  const update = (id: string, key: keyof AcademicWorkItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Title</Label>
              <Input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="The Role of L1 in EFL Classrooms" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={item.type} onChange={e => update(item.id, 'type', e.target.value)}>
                <option value="paper">Research Paper</option>
                <option value="thesis">Thesis / Dissertation</option>
                <option value="project">Project</option>
                <option value="presentation">Conference Presentation</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input value={item.date} onChange={e => update(item.id, 'date', e.target.value)} placeholder="May 2024" />
            </div>
            <div className="col-span-2">
              <Label>Description / Abstract</Label>
              <Textarea value={item.description ?? ''} onChange={e => update(item.id, 'description', e.target.value)} rows={3} placeholder="Brief summary of the work…" />
            </div>
            <div className="col-span-2">
              <Label>Upload File (or paste URL below)</Label>
              <FileUploader
                userId={userId}
                folder="academic"
                type="pdf"
                accept="application/pdf,.doc,.docx"
                currentUrl={item.file_url}
                onUpload={url => update(item.id, 'file_url', url)}
                label="Upload PDF or Doc"
                preview
              />
            </div>
            <div className="col-span-2">
              <Label>Or paste external link (optional)</Label>
              <Input value={item.file_url ?? ''} onChange={e => update(item.id, 'file_url', e.target.value)} placeholder="https://…" type="url" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Academic Work" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
