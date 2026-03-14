'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Textarea, Select, Card, AddButton } from './shared'
import { generateId, getEmbedUrl } from '@/lib/utils'
import type { VideosData, VideoItem } from '@/types'

const blank = (): VideoItem => ({
  id: generateId(), title: '', url: '', type: 'micro_teaching', description: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function VideosEditor({ data, onSave }: Props) {
  const d = data as Partial<VideosData>
  const [items, setItems] = useState<VideoItem[]>(d.items ?? [])

  const update = (id: string, key: keyof VideoItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Paste YouTube or Vimeo links — they&apos;ll be embedded on your portfolio.</p>
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Micro-Teaching: Reading Strategies" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={item.type} onChange={e => update(item.id, 'type', e.target.value)}>
                <option value="micro_teaching">Micro-Teaching</option>
                <option value="mock_lesson">Mock Lesson</option>
                <option value="reflection">Reflection Video</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label>YouTube / Vimeo URL</Label>
              <Input value={item.url} onChange={e => update(item.id, 'url', e.target.value)} placeholder="https://youtube.com/watch?v=…" type="url" />
            </div>
            {item.url && getEmbedUrl(item.url) && (
              <div className="rounded-lg overflow-hidden aspect-video bg-gray-100">
                <iframe
                  src={getEmbedUrl(item.url)!}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                />
              </div>
            )}
            <div>
              <Label>Description</Label>
              <Textarea value={item.description ?? ''} onChange={e => update(item.id, 'description', e.target.value)} rows={2} placeholder="What this video demonstrates…" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Video" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
