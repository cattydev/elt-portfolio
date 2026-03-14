'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import FileUploader from '@/components/ui/FileUploader'
import { generateId } from '@/lib/utils'
import type { MaterialsData, MaterialItem } from '@/types'

const blank = (): MaterialItem => ({
  id: generateId(), title: '', type: 'worksheet', file_url: '', description: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function MaterialsEditor({ data, onSave, userId }: Props) {
  const d = data as Partial<MaterialsData>
  const [items, setItems] = useState<MaterialItem[]>(d.items ?? [])

  const update = (id: string, key: keyof MaterialItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Material Title</Label>
              <Input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Vocabulary Bingo Game" />
            </div>
            <div className="col-span-2">
              <Label>Type</Label>
              <Select value={item.type} onChange={e => update(item.id, 'type', e.target.value)}>
                <option value="worksheet">Worksheet</option>
                <option value="activity">Activity</option>
                <option value="game">Game</option>
                <option value="presentation">Presentation</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Upload File</Label>
              <FileUploader
                userId={userId}
                folder="materials"
                type="any"
                accept="application/pdf,.doc,.docx,.ppt,.pptx,image/*"
                currentUrl={item.file_url}
                onUpload={url => update(item.id, 'file_url', url)}
                label="Upload PDF, Doc, or Image"
                preview
              />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={item.description ?? ''} onChange={e => update(item.id, 'description', e.target.value)} rows={2} placeholder="Suitable for B1 level, 20–25 students…" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Material" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
