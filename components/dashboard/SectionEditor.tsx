'use client'

import type { PortfolioSection } from '@/types'
import { SECTION_ICONS } from '@/types'
import { X } from 'lucide-react'
import AboutEditor from '../sections/editors/AboutEditor'
import EducationEditor from '../sections/editors/EducationEditor'
import ExperienceEditor from '../sections/editors/ExperienceEditor'
import LessonPlansEditor from '../sections/editors/LessonPlansEditor'
import MaterialsEditor from '../sections/editors/MaterialsEditor'
import VideosEditor from '../sections/editors/VideosEditor'
import LanguageProficiencyEditor from '../sections/editors/LanguageProficiencyEditor'
import CertificatesEditor from '../sections/editors/CertificatesEditor'
import ReflectionsEditor from '../sections/editors/ReflectionsEditor'
import AcademicWorksEditor from '../sections/editors/AcademicWorksEditor'
import SkillsEditor from '../sections/editors/SkillsEditor'
import TeachingPhilosophyEditor from '../sections/editors/TeachingPhilosophyEditor'
import AssessmentEditor from '../sections/editors/AssessmentEditor'
import StudentWorkSamplesEditor from '../sections/editors/StudentWorkSamplesEditor'

interface Props {
  section: PortfolioSection
  userId: string
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>
  onClose: () => void
}

export default function SectionEditor({ section, userId, onUpdate, onClose }: Props) {
  const save = (data: Record<string, unknown>) => onUpdate(section.id, data)

  const renderEditor = () => {
    switch (section.type) {
      case 'about': return <AboutEditor data={section.data} onSave={save} userId={userId} />
      case 'education': return <EducationEditor data={section.data} onSave={save} />
      case 'experience': return <ExperienceEditor data={section.data} onSave={save} />
      case 'lesson_plans': return <LessonPlansEditor data={section.data} onSave={save} userId={userId} />
      case 'materials': return <MaterialsEditor data={section.data} onSave={save} userId={userId} />
      case 'videos': return <VideosEditor data={section.data} onSave={save} />
      case 'language_proficiency': return <LanguageProficiencyEditor data={section.data} onSave={save} />
      case 'certificates': return <CertificatesEditor data={section.data} onSave={save} userId={userId} />
      case 'reflections': return <ReflectionsEditor data={section.data} onSave={save} />
      case 'academic_works': return <AcademicWorksEditor data={section.data} onSave={save} userId={userId} />
      case 'skills': return <SkillsEditor data={section.data} onSave={save} />
      case 'teaching_philosophy': return <TeachingPhilosophyEditor data={section.data} onSave={save} />
      case 'assessment_evaluation': return <AssessmentEditor data={section.data} onSave={save} userId={userId} />
      case 'student_work_samples': return <StudentWorkSamplesEditor data={section.data} onSave={save} userId={userId} />
      default: return <p className="text-gray-400 text-sm">Editor coming soon.</p>
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">{SECTION_ICONS[section.type]}</span>
          <h2 className="font-semibold text-gray-800">{section.title}</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 sm:p-6 overflow-y-auto flex-1">
        {renderEditor()}
      </div>
    </div>
  )
}
