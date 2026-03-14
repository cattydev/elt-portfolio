'use client'

import { Loader2, Save, Trash2, Plus } from 'lucide-react'
import { useState, useCallback } from 'react'

interface SaveButtonProps {
  onSave: () => Promise<void>
}

export function SaveButton({ onSave }: SaveButtonProps) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handle = useCallback(async () => {
    setLoading(true)
    await onSave()
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [onSave])

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      {loading
        ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
        : saved
        ? '✓ Saved!'
        : <><Save className="w-4 h-4" />Save</>
      }
    </button>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-gray-600 mb-1">{children}</label>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.className ?? ''}`}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${props.className ?? ''}`}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${props.className ?? ''}`}
    />
  )
}

export function Card({ children, onDelete }: { children: React.ReactNode; onDelete?: () => void }) {
  return (
    <div className="relative border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  )
}

export function AddButton({ onClick, label = 'Add Item' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-xl py-3 text-sm font-medium transition-all"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  )
}

export { useState, useCallback }
