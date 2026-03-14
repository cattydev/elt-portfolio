'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, X, FileText, Image as ImageIcon, Check } from 'lucide-react'

type UploadType = 'image' | 'pdf' | 'any'

interface Props {
  userId: string
  folder: string
  accept?: string
  type?: UploadType
  currentUrl?: string
  onUpload: (url: string) => void
  label?: string
  className?: string
  preview?: boolean
}

const ACCEPT_MAP: Record<UploadType, string> = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  pdf: 'application/pdf',
  any: 'image/*,application/pdf,.doc,.docx,.ppt,.pptx',
}

export default function FileUploader({
  userId, folder, accept, type = 'any', currentUrl,
  onUpload, label = 'Upload File', className = '', preview = false,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFile = async (file: File) => {
    if (!file) return
    setUploading(true)
    setError(null)
    setDone(false)

    const ext = file.name.split('.').pop()
    const path = `${userId}/${folder}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('portfolios')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('portfolios').getPublicUrl(path)
    onUpload(data.publicUrl)
    setUploading(false)
    setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const isImage = (url?: string) => url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url)

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Preview */}
      {preview && currentUrl && (
        <div className="relative group">
          {isImage(currentUrl) ? (
            <img src={currentUrl} alt="Preview" className="w-full max-h-48 object-cover rounded-xl border border-gray-200" />
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="truncate">{currentUrl.split('/').pop()}</span>
              <a href={currentUrl} target="_blank" rel="noopener" className="ml-auto text-indigo-600 hover:underline text-xs flex-shrink-0">View</a>
            </div>
          )}
          <button
            onClick={() => onUpload('')}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 rounded-full p-1 shadow transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl px-4 py-4 text-center cursor-pointer transition-all
          ${uploading ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}
          ${done ? 'border-green-300 bg-green-50' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? ACCEPT_MAP[type]}
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex items-center justify-center gap-2 text-sm">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-indigo-600">Uploading…</span>
            </>
          ) : done ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Uploaded!</span>
            </>
          ) : (
            <>
              {type === 'image' ? <ImageIcon className="w-4 h-4 text-gray-400" /> : <Upload className="w-4 h-4 text-gray-400" />}
              <span className="text-gray-500">{label}</span>
              <span className="text-xs text-gray-300">or drag & drop</span>
            </>
          )}
        </div>
        {!uploading && !done && (
          <p className="text-xs text-gray-300 mt-1">
            {type === 'image' ? 'JPG, PNG, WebP up to 5MB' : type === 'pdf' ? 'PDF up to 20MB' : 'Image, PDF, Doc up to 20MB'}
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
