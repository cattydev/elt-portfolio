import type { PortfolioSection } from '@/types'
import { getEmbedUrl } from '@/lib/utils'
import type {
  AboutData, EducationData, ExperienceData, LessonPlansData,
  MaterialsData, VideosData, LanguageProficiencyData, CertificatesData,
  ReflectionsData, AcademicWorksData, SkillsData,
  TeachingPhilosophyData, AssessmentData, StudentWorkSamplesData
} from '@/types'
import { ExternalLink, FileText, Video, Globe, Mail, Linkedin } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-gray-200 text-gray-700', A2: 'bg-gray-300 text-gray-700',
  B1: 'bg-blue-100 text-blue-700', B2: 'bg-blue-200 text-blue-800',
  C1: 'bg-indigo-200 text-indigo-800', C2: 'bg-purple-200 text-purple-800',
  Native: 'bg-green-100 text-green-700',
}

interface Props {
  section: PortfolioSection
  accent?: string
}

export default function SectionRenderer({ section, accent = 'text-indigo-600' }: Props) {
  switch (section.type) {
    case 'about': {
      const d = section.data as Partial<AboutData>
      return (
        <div className="space-y-4">
          {d.photo_url && (
            <img src={d.photo_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
          )}
          {d.bio && <p className="text-gray-600 leading-relaxed">{d.bio}</p>}
          <div className="flex flex-wrap gap-3 text-sm">
            {d.location && <span className="text-gray-500">📍 {d.location}</span>}
            {d.email && (
              <a href={`mailto:${d.email}`} className={`flex items-center gap-1 ${accent} hover:underline`}>
                <Mail className="w-3.5 h-3.5" />{d.email}
              </a>
            )}
            {d.linkedin && (
              <a href={d.linkedin} target="_blank" rel="noopener" className={`flex items-center gap-1 ${accent} hover:underline`}>
                <Linkedin className="w-3.5 h-3.5" />LinkedIn
              </a>
            )}
            {d.website && (
              <a href={d.website} target="_blank" rel="noopener" className={`flex items-center gap-1 ${accent} hover:underline`}>
                <Globe className="w-3.5 h-3.5" />Website
              </a>
            )}
          </div>
        </div>
      )
    }

    case 'education': {
      const d = section.data as Partial<EducationData>
      return (
        <div className="space-y-4">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border-l-2 border-gray-200 pl-4">
              <div className="font-semibold text-gray-800">{item.institution}</div>
              <div className="text-sm text-gray-600">{item.degree} in {item.field}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.start_year} — {item.end_year}</div>
              {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
            </div>
          ))}
        </div>
      )
    }

    case 'experience': {
      const d = section.data as Partial<ExperienceData>
      return (
        <div className="space-y-4">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.organization}</div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize whitespace-nowrap">
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {item.start_date} — {item.current ? 'Present' : item.end_date}
              </div>
              {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
            </div>
          ))}
        </div>
      )
    }

    case 'lesson_plans': {
      const d = section.data as Partial<LessonPlansData>
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                {item.level && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">{item.level}</span>}
              </div>
              {item.topic && <div className="text-xs text-gray-500 mt-1">{item.topic}</div>}
              {item.duration && <div className="text-xs text-gray-400 mt-0.5">⏱ {item.duration}</div>}
              {item.description && <p className="text-xs text-gray-500 mt-2">{item.description}</p>}
              {item.file_url && (
                <a href={item.file_url} target="_blank" rel="noopener"
                  className={`mt-2 inline-flex items-center gap-1 text-xs ${accent} hover:underline`}>
                  <FileText className="w-3 h-3" />View Plan
                </a>
              )}
            </div>
          ))}
        </div>
      )
    }

    case 'materials': {
      const d = section.data as Partial<MaterialsData>
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize flex-shrink-0">{item.type}</span>
              </div>
              {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
              {item.file_url && (
                <a href={item.file_url} target="_blank" rel="noopener"
                  className={`mt-2 inline-flex items-center gap-1 text-xs ${accent} hover:underline`}>
                  <FileText className="w-3 h-3" />Download
                </a>
              )}
            </div>
          ))}
        </div>
      )
    }

    case 'videos': {
      const d = section.data as Partial<VideosData>
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="space-y-2">
              {item.url && getEmbedUrl(item.url) ? (
                <div className="rounded-xl overflow-hidden aspect-video bg-gray-100 shadow-sm">
                  <iframe src={getEmbedUrl(item.url)!} className="w-full h-full" allowFullScreen />
                </div>
              ) : (
                <div className="rounded-xl aspect-video bg-gray-100 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <div className="font-medium text-gray-800 text-sm">{item.title}</div>
              {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
            </div>
          ))}
        </div>
      )
    }

    case 'language_proficiency': {
      const d = section.data as Partial<LanguageProficiencyData>
      return (
        <div className="space-y-3">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-32 font-medium text-gray-700 text-sm">{item.language}</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLORS[item.level] ?? 'bg-gray-100 text-gray-600'}`}>
                {item.level}
              </span>
              {item.certificate && <span className="text-sm text-gray-500">{item.certificate}</span>}
              {item.score && <span className="text-sm text-gray-400">({item.score})</span>}
            </div>
          ))}
        </div>
      )
    }

    case 'certificates': {
      const d = section.data as Partial<CertificatesData>
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.issuer} · {item.date}</div>
              <div className="flex gap-3 mt-2">
                {item.file_url && (
                  <a href={item.file_url} target="_blank" rel="noopener"
                    className={`inline-flex items-center gap-1 text-xs ${accent} hover:underline`}>
                    <FileText className="w-3 h-3" />View
                  </a>
                )}
                {item.credential_url && (
                  <a href={item.credential_url} target="_blank" rel="noopener"
                    className={`inline-flex items-center gap-1 text-xs ${accent} hover:underline`}>
                    <ExternalLink className="w-3 h-3" />Verify
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'reflections': {
      const d = section.data as Partial<ReflectionsData>
      return (
        <div className="space-y-4">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-semibold text-gray-800">{item.title}</div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.content}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    case 'academic_works': {
      const d = section.data as Partial<AcademicWorksData>
      return (
        <div className="space-y-3">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border-l-2 border-indigo-200 pl-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 capitalize">{item.type.replace('_', ' ')} · {item.date}</div>
                  {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                </div>
                {item.file_url && (
                  <a href={item.file_url} target="_blank" rel="noopener"
                    className={`${accent} hover:underline flex-shrink-0`}>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'skills': {
      const d = section.data as Partial<SkillsData>
      return (
        <div className="space-y-4">
          {(d.methodologies ?? []).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Methodologies</div>
              <div className="flex flex-wrap gap-2">
                {d.methodologies!.map(m => (
                  <span key={m} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{m}</span>
                ))}
              </div>
            </div>
          )}
          {(d.technologies ?? []).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">EdTech & Tools</div>
              <div className="flex flex-wrap gap-2">
                {d.technologies!.map(t => (
                  <span key={t} className="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {(d.categories ?? []).map(cat => (
            <div key={cat.id}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat.category}</div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(s => (
                  <span key={s} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'teaching_philosophy': {
      const d = section.data as Partial<TeachingPhilosophyData>
      return (
        <div className="space-y-5">
          {d.statement && (
            <p className="text-gray-700 leading-relaxed text-base italic border-l-4 border-indigo-300 pl-4">
              "{d.statement}"
            </p>
          )}
          {(d.principles ?? []).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Core Principles</div>
              <div className="space-y-2">
                {d.principles!.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`text-sm font-bold flex-shrink-0 ${accent}`}>✦</span>
                    <p className="text-sm text-gray-700">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {d.approach && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Approach</div>
              <p className="text-sm text-gray-600 leading-relaxed">{d.approach}</p>
            </div>
          )}
          {d.influences && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Influences</div>
              <p className="text-sm text-gray-500">{d.influences}</p>
            </div>
          )}
        </div>
      )
    }

    case 'assessment_evaluation': {
      const d = section.data as Partial<AssessmentData>
      const typeColors: Record<string, string> = {
        formative: 'bg-blue-100 text-blue-700',
        summative: 'bg-purple-100 text-purple-700',
        diagnostic: 'bg-yellow-100 text-yellow-700',
        portfolio: 'bg-green-100 text-green-700',
        rubric: 'bg-orange-100 text-orange-700',
        peer: 'bg-pink-100 text-pink-700',
        self: 'bg-teal-100 text-teal-700',
        other: 'bg-gray-100 text-gray-600',
      }
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${typeColors[item.type] ?? typeColors.other}`}>
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
              {item.file_url && (
                <a href={item.file_url} target="_blank" rel="noopener"
                  className={`mt-2 inline-flex items-center gap-1 text-xs ${accent} hover:underline`}>
                  <FileText className="w-3 h-3" />View File
                </a>
              )}
            </div>
          ))}
        </div>
      )
    }

    case 'student_work_samples': {
      const d = section.data as Partial<StudentWorkSamplesData>
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(d.items ?? []).map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                {item.level && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">{item.level}</span>
                )}
              </div>
              {item.activity_type && (
                <div className="text-xs text-gray-500 mt-0.5">🎯 {item.activity_type}</div>
              )}
              {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
              {item.file_url && (
                <a href={item.file_url} target="_blank" rel="noopener"
                  className={`mt-2 inline-flex items-center gap-1 text-xs ${accent} hover:underline`}>
                  <FileText className="w-3 h-3" />View Sample
                </a>
              )}
            </div>
          ))}
        </div>
      )
    }

    default:
      return null
  }
}
