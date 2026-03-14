'use client'

import type { Theme } from '@/types'
import { THEME_LABELS } from '@/types'
import { Check } from 'lucide-react'

const THEMES: { id: Theme; description: string; preview: string }[] = [
  {
    id: 'minimal',
    description: 'Clean, white-focused — professional & elegant',
    preview: 'bg-white text-gray-900 border-gray-200',
  },
  {
    id: 'academic',
    description: 'Deep navy tones — scholarly and trustworthy',
    preview: 'bg-slate-800 text-white border-slate-700',
  },
  {
    id: 'creative',
    description: 'Vibrant indigo/purple — modern and expressive',
    preview: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-purple-400',
  },
]

interface Props {
  currentTheme: Theme
  onSelect: (theme: Theme) => void
}

export default function ThemeSelector({ currentTheme, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <h2 className="font-semibold text-gray-800 text-sm">Portfolio Theme</h2>
      <p className="text-xs text-gray-400">Choose how your public portfolio looks to visitors.</p>
      <div className="space-y-2">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all ${
              currentTheme === theme.id
                ? 'border-indigo-500 ring-2 ring-indigo-200'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className={`h-12 ${theme.preview} flex items-center justify-between px-4`}>
              <span className="text-sm font-medium">{THEME_LABELS[theme.id]}</span>
              {currentTheme === theme.id && (
                <Check className="w-4 h-4" />
              )}
            </div>
            <div className="px-3 py-2 bg-white">
              <p className="text-xs text-gray-500">{theme.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
