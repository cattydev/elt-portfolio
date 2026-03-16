export type SectionType =
  | 'about'
  | 'education'
  | 'experience'
  | 'lesson_plans'
  | 'materials'
  | 'videos'
  | 'language_proficiency'
  | 'certificates'
  | 'reflections'
  | 'academic_works'
  | 'skills'
  | 'teaching_philosophy'
  | 'assessment_evaluation'
  | 'student_work_samples'

export type Theme = 'minimal' | 'academic' | 'creative'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  cover_url: string | null
  bio: string | null
  theme: Theme
  created_at: string
  updated_at: string
}

export interface PortfolioSection {
  id: string
  profile_id: string
  type: SectionType
  title: string
  position: number
  visible: boolean
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Section data types
export interface AboutData {
  bio: string
  location?: string
  email?: string
  linkedin?: string
  website?: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  start_year: string
  end_year: string
  description?: string
}
export interface EducationData { items: EducationItem[] }

export interface ExperienceItem {
  id: string
  title: string
  organization: string
  type: 'internship' | 'volunteer' | 'part_time' | 'full_time'
  start_date: string
  end_date?: string
  current: boolean
  description?: string
}
export interface ExperienceData { items: ExperienceItem[] }

export interface LessonPlanItem {
  id: string
  title: string
  level: string
  topic: string
  duration: string
  file_url?: string
  description?: string
  student_work_url?: string
}
export interface LessonPlansData { items: LessonPlanItem[] }

export interface MaterialItem {
  id: string
  title: string
  type: 'worksheet' | 'activity' | 'game' | 'presentation' | 'other'
  file_url?: string
  description?: string
}
export interface MaterialsData { items: MaterialItem[] }

export interface VideoItem {
  id: string
  title: string
  url: string
  type: 'micro_teaching' | 'mock_lesson' | 'reflection' | 'other'
  description?: string
}
export interface VideosData { items: VideoItem[] }

export interface LanguageItem {
  id: string
  language: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native'
  certificate?: string
  score?: string
}
export interface LanguageProficiencyData { items: LanguageItem[] }

export interface CertificateItem {
  id: string
  name: string
  issuer: string
  date: string
  file_url?: string
  credential_url?: string
}
export interface CertificatesData { items: CertificateItem[] }

export interface ReflectionItem {
  id: string
  title: string
  date: string
  content: string
  tags?: string[]
}
export interface ReflectionsData { items: ReflectionItem[] }

export interface AcademicWorkItem {
  id: string
  title: string
  type: 'paper' | 'thesis' | 'project' | 'presentation' | 'other'
  date: string
  description?: string
  file_url?: string
}
export interface AcademicWorksData { items: AcademicWorkItem[] }

export interface SkillCategory {
  id: string
  category: string
  skills: string[]
}
export interface SkillsData {
  methodologies: string[]
  technologies: string[]
  categories: SkillCategory[]
}

export interface TeachingPhilosophyData {
  statement: string
  principles: string[]
  approach?: string
  influences?: string
}

export interface AssessmentItem {
  id: string
  title: string
  type: 'formative' | 'summative' | 'diagnostic' | 'portfolio' | 'rubric' | 'peer' | 'self' | 'other'
  description?: string
  file_url?: string
}
export interface AssessmentData { items: AssessmentItem[] }

export interface StudentWorkItem {
  id: string
  title: string
  level: string
  activity_type: string
  description?: string
  file_url?: string
  image_url?: string
}
export interface StudentWorkSamplesData { items: StudentWorkItem[] }

export const SECTION_LABELS: Record<SectionType, string> = {
  about: 'About Me',
  education: 'Education',
  experience: 'Teaching Experience',
  lesson_plans: 'Lesson Plans',
  materials: 'Teaching Materials',
  videos: 'Videos',
  language_proficiency: 'Language Proficiency',
  certificates: 'Certificates',
  reflections: 'Reflections',
  academic_works: 'Academic Works',
  skills: 'Skills & Methodologies',
  teaching_philosophy: 'Teaching Philosophy',
  assessment_evaluation: 'Assessment & Evaluation',
  student_work_samples: 'Student Work Samples',
}

export const SECTION_ICONS: Record<SectionType, string> = {
  about: '👤',
  education: '🎓',
  experience: '📚',
  lesson_plans: '📝',
  materials: '📂',
  videos: '🎥',
  language_proficiency: '🌍',
  certificates: '🏆',
  reflections: '💭',
  academic_works: '🔬',
  skills: '⚡',
  teaching_philosophy: '🌱',
  assessment_evaluation: '📊',
  student_work_samples: '🖼️',
}

export const THEME_LABELS: Record<Theme, string> = {
  minimal: 'Minimal',
  academic: 'Academic',
  creative: 'Creative',
}
