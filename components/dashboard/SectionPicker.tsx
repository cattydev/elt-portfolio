'use client'

import { SECTION_LABELS, SECTION_ICONS } from '@/types'
import type { SectionType } from '@/types'
import { X } from 'lucide-react'

const ALL_SECTIONS: SectionType[] = [
  'about', 'education', 'experience', 'teaching_philosophy',
  'lesson_plans', 'materials', 'student_work_samples', 'assessment_evaluation',
  'videos', 'language_proficiency', 'certificates', 'reflections',
  'academic_works', 'skills'
]

interface Props {
  existingTypes: SectionType[]
  onSelect: (type: SectionType) => void
  onClose: () => void
}

export default function SectionPicker({ existingTypes, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-semibold text-gray-800">Add a Section</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
          {ALL_SECTIONS.map(type => {
            const already = existingTypes.includes(type)
            return (
              <button
                key={type}
                onClick={() => !already && onSelect(type)}
                disabled={already}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all active:scale-95 ${
                  already
                    ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 active:bg-indigo-100 cursor-pointer'
                }`}
              >
                <span className="text-2xl">{SECTION_ICONS[type]}</span>
                <span className="text-xs font-medium text-gray-700 leading-tight">{SECTION_LABELS[type]}</span>
                {already && <span className="text-xs text-gray-400">Added</span>}
              </button>
            )
          })}
        </div>
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
