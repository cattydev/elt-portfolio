'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Select, Card, AddButton } from './shared'
import { generateId } from '@/lib/utils'
import type { LanguageProficiencyData, LanguageItem } from '@/types'

const blank = (): LanguageItem => ({
  id: generateId(), language: '', level: 'B2', certificate: '', score: '',
})

const CEFR_LEVELS = ['A1','A2','B1','B2','C1','C2','Native']

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function LanguageProficiencyEditor({ data, onSave }: Props) {
  const d = data as Partial<LanguageProficiencyData>
  const [items, setItems] = useState<LanguageItem[]>(d.items ?? [])

  const update = (id: string, key: keyof LanguageItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Language</Label>
              <Input value={item.language} onChange={e => update(item.id, 'language', e.target.value)} placeholder="English" />
            </div>
            <div>
              <Label>CEFR Level</Label>
              <Select value={item.level} onChange={e => update(item.id, 'level', e.target.value as LanguageItem['level'])}>
                {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </Select>
            </div>
            <div>
              <Label>Certificate (optional)</Label>
              <Input value={item.certificate ?? ''} onChange={e => update(item.id, 'certificate', e.target.value)} placeholder="IELTS, YDS, TOEFL…" />
            </div>
            <div>
              <Label>Score (optional)</Label>
              <Input value={item.score ?? ''} onChange={e => update(item.id, 'score', e.target.value)} placeholder="7.5 / 92 / 87.5" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Language" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
