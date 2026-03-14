import Link from 'next/link'
import { BookOpen, Layout, Globe, Palette, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: '📝', title: 'Modular Sections', desc: 'Add lesson plans, reflections, videos, certificates and more — in any order you like.' },
  { icon: '🎨', title: '3 Beautiful Themes', desc: 'Choose Minimal, Academic, or Creative. Switch anytime from your dashboard.' },
  { icon: '🌍', title: 'Public Portfolio Link', desc: 'Get a shareable URL — perfect for job applications and teaching practice.' },
  { icon: '📚', title: 'Made for ELT', desc: 'CEFR levels, micro-teaching videos, reflections, lesson plans — all built in for ELT students.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            ELT Portfolio
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link href="/auth/signup" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✨ Built for ELT Students
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            Your Teaching Journey,<br />
            <span className="text-indigo-600">Beautifully Presented</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Create a professional portfolio that showcases your lesson plans, reflections, language proficiency, and teaching videos — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Create your portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Everything you need</h2>
        <p className="text-gray-500 text-center mb-12 text-lg">Purpose-built sections for ELT students</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-6 hover:bg-indigo-50 transition-colors group">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections showcase */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">11 portfolio sections</h2>
          <p className="text-gray-500 mb-10">Pick the ones that represent you best</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              ['👤', 'About Me'], ['🎓', 'Education'], ['📚', 'Experience'],
              ['📝', 'Lesson Plans'], ['📂', 'Materials'], ['🎥', 'Videos'],
              ['🌍', 'Language Proficiency'], ['🏆', 'Certificates'],
              ['💭', 'Reflections'], ['🔬', 'Academic Works'], ['⚡', 'Skills'],
            ].map(([icon, label]) => (
              <span key={label as string} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-gray-500 text-lg mb-8">It takes less than 2 minutes to create your portfolio.</p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg"
        >
          Create your free portfolio
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        ELT Portfolio — Made for English Language Teaching students
      </footer>
    </div>
  )
}
