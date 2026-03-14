'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Card, AddButton } from './shared'
import { generateId } from '@/lib/utils'
import type { SkillsData, SkillCategory } from '@/types'
import { X } from 'lucide-react'

const METHODOLOGY_SUGGESTIONS = [
  'CLT', 'TBL', 'PPP', 'CLIL', 'TBLT', 'Flipped Classroom',
  'Dogme ELT', 'Genre-based Teaching', 'Content-based Instruction',
]

const TECH_SUGGESTIONS = [
  'Duolingo', 'Quizlet', 'Google Classroom', 'Moodle', 'Padlet',
  'Kahoot', 'Jamboard', 'Flipgrid', 'Zoom', 'Smart Board',
]

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
}

function TagInput({ tags, onChange, suggestions }: {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
}) {
  const [input, setInput] = useState('')

  const add = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed])
    setInput('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
            {tag}
            <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) } }}
          placeholder="Type and press Enter…"
          className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={() => add(input)} className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">Add</button>
      </div>
      {suggestions && (
        <div className="flex flex-wrap gap-1">
          {suggestions.filter(s => !tags.includes(s)).slice(0, 6).map(s => (
            <button key={s} onClick={() => add(s)} className="text-xs text-gray-400 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-2 py-0.5 rounded-full transition-colors">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SkillsEditor({ data, onSave }: Props) {
  const d = data as Partial<SkillsData>
  const [methodologies, setMethodologies] = useState<string[]>(d.methodologies ?? [])
  const [technologies, setTechnologies] = useState<string[]>(d.technologies ?? [])
  const [categories, setCategories] = useState<SkillCategory[]>(d.categories ?? [])

  const addCategory = () =>
    setCategories(p => [...p, { id: generateId(), category: '', skills: [] }])

  const updateCategory = (id: string, key: keyof SkillCategory, value: unknown) =>
    setCategories(p => p.map(c => c.id === id ? { ...c, [key]: value } : c))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Teaching Methodologies</h3>
        <TagInput tags={methodologies} onChange={setMethodologies} suggestions={METHODOLOGY_SUGGESTIONS} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">EdTech & Tools</h3>
        <TagInput tags={technologies} onChange={setTechnologies} suggestions={TECH_SUGGESTIONS} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Other Skill Categories</h3>
          <button onClick={addCategory} className="text-xs text-indigo-600 hover:underline">+ Add Category</button>
        </div>
        <div className="space-y-3">
          {categories.map(cat => (
            <Card key={cat.id} onDelete={() => setCategories(p => p.filter(c => c.id !== cat.id))}>
              <div className="space-y-2">
                <div>
                  <Label>Category Name</Label>
                  <Input
                    value={cat.category}
                    onChange={e => updateCategory(cat.id, 'category', e.target.value)}
                    placeholder="e.g. Classroom Management, Assessment…"
                  />
                </div>
                <div>
                  <Label>Skills</Label>
                  <TagInput tags={cat.skills} onChange={skills => updateCategory(cat.id, 'skills', skills)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ methodologies, technologies, categories } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
