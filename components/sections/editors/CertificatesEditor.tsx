'use client'

import { useState } from 'react'
import { SaveButton, Label, Input, Card, AddButton } from './shared'
import FileUploader from '@/components/ui/FileUploader'
import { generateId } from '@/lib/utils'
import type { CertificatesData, CertificateItem } from '@/types'

const blank = (): CertificateItem => ({
  id: generateId(), name: '', issuer: '', date: '', file_url: '', credential_url: '',
})

interface Props {
  data: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => Promise<void>
  userId: string
}

export default function CertificatesEditor({ data, onSave, userId }: Props) {
  const d = data as Partial<CertificatesData>
  const [items, setItems] = useState<CertificateItem[]>(d.items ?? [])

  const update = (id: string, key: keyof CertificateItem, value: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i))

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Certificate Name</Label>
              <Input value={item.name} onChange={e => update(item.id, 'name', e.target.value)} placeholder="IELTS Academic / CELTA / YDS…" />
            </div>
            <div>
              <Label>Issuing Organization</Label>
              <Input value={item.issuer} onChange={e => update(item.id, 'issuer', e.target.value)} placeholder="British Council" />
            </div>
            <div>
              <Label>Date</Label>
              <Input value={item.date} onChange={e => update(item.id, 'date', e.target.value)} placeholder="June 2023" />
            </div>
            <div className="col-span-2">
              <Label>Upload Certificate (PDF / Image / Scan)</Label>
              <FileUploader
                userId={userId}
                folder="certificates"
                type="any"
                accept="application/pdf,image/*"
                currentUrl={item.file_url}
                onUpload={url => update(item.id, 'file_url', url)}
                label="Upload PDF or image scan"
                preview
              />
            </div>
            <div className="col-span-2">
              <Label>Credential Verify URL (optional)</Label>
              <Input value={item.credential_url ?? ''} onChange={e => update(item.id, 'credential_url', e.target.value)} placeholder="https://…" type="url" />
            </div>
          </div>
        </Card>
      ))}
      <AddButton onClick={() => setItems(p => [...p, blank()])} label="Add Certificate" />
      <div className="flex justify-end pt-2">
        <SaveButton onSave={() => onSave({ items } as unknown as Record<string, unknown>)} />
      </div>
    </div>
  )
}
