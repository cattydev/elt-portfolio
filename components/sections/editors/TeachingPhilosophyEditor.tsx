'use client'

import { useState } from 'react'
import { SaveButton, Label, Textarea, Input } from './shared'
import { Plus, Trash2 } from 'lucide-react'
import { generateId } from '@/lib/utils'
import type { TeachingPhilosophyData } from '@/types'

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

export default function TeachingPhilosophyEditor({ data, onSave }: Props) {
  const d = data as Partial<TeachingPhilosophyData>
  const [form, setForm] = useState<TeachingPhilosophyData>({
    statement: d.statement ?? '',
    principles: d.principles ?? [],
    approach: d.approach ?? '',
    influences: d.influences ?? '',
  })
  const [newPrinciple, setNewPrinciple] = useState('')

  const addPrinciple = () => {
    if (!newPrinciple.trim()) return
    setForm(f => ({ ...f, principles: [...f.principles, newPrinciple.trim()] }))
    setNewPrinciple('')
  }

  const removePrinciple = (i: number) =>
    setForm(f => ({ ...f, principles: f.principles.filter((_, idx) => idx !== i) }))

  return (
    <div className="space-y-4">
      <div>
        <Label>Teaching Philosophy Statement</Label>
        <Textarea
          value={form.statement}
          onChange={e => setForm(f => ({ ...f, statement: e.target.value }))}
          rows={5}
          placeholder="I believe language learning is most effective when students feel safe to take risks…"
        />
      </div>

      <div>
        <Label>Core Teaching Principles</Label>
        <div className="space-y-2 mb-2">
          {form.principles.map((p, i) => (
            <div key={generateId()} className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm text-indigo-800">✦ {p}</span>
              <button onClick={() => removePrinciple(i)} className="text-indigo-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newPrinciple}
            onChange={e => setNewPrinciple(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPrinciple())}
            placeholder="e.g. Learner autonomy is central to my practice"
          />
          <button
            onClick={addPrinciple}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div>
        <Label>Teaching Approach / Methodology</Label>
        <Textarea
          value={form.approach ?? ''}
          onChange={e => setForm(f => ({ ...f, approach: e.target.value }))}
          rows={3}
          placeholder="I primarily use Communicative Language Teaching (CLT) combined with Task-Based Learning…"
        />
      </div>

      <div>
        <Label>Influences & Inspirations</Label>
        <Input
          value={form.influences ?? ''}
          onChange={e => setForm(f => ({ ...f, influences: e.target.value }))}
          placeholder="e.g. Stephen Krashen's Input Hypothesis, Paulo Freire's critical pedagogy…"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <SaveButton onSave={() => onSave(form as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
