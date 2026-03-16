'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import FileUploader from '@/components/ui/FileUploader'
import { generateId } from '@/lib/utils'
import type { AssessmentData, AssessmentItem } from '@/types'

const blank = (): AssessmentItem => ({
  id: generateId(), title: '', type: 'formative', description: '', file_url: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function AssessmentEditor({ data, onSave, userId }: Props) {
  const d = data as Partial<AssessmentData>
  const [items, setItems] = useState<AssessmentItem[]>(d.items ?? [])

  const update = (id: string, key: keyof AssessmentItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="space-y-3">
            <div>
              <Label>Assessment Title</Label>
              <Input
                value={item.title}
                onChange={e => update(item.id, 'title', e.target.value)}
                placeholder="Reading Comprehension Rubric"
              />
            </div>
            <div>
              <Label>Assessment Type</Label>
              <Select value={item.type} onChange={e => update(item.id, 'type', e.target.value)}>
                <option value="formative">Formative</option>
                <option value="summative">Summative</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="portfolio">Portfolio</option>
                <option value="rubric">Rubric</option>
                <option value="peer">Peer Assessment</option>
                <option value="self">Self Assessment</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={item.description ?? ''}
                onChange={e => update(item.id, 'description', e.target.value)}
                rows={3}
                placeholder="Describe the assessment tool, when and how it is used…"
              />
            </div>
            <div>
              <Label>Upload Assessment File (PDF / Doc)</Label>
              <FileUploader
                userId={userId}
                folder="assessment"
                type="pdf"
                accept="application/pdf,.doc,.docx"
                currentUrl={item.file_url}
                onUpload={url => update(item.id, 'file_url', url)}
                label="Upload File"
                preview
              />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Assessment Tool" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
