import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Layers, Terminal, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

// SVG สำหรับไอคอน GitHub
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

// คอมโพเนนต์ลูกที่รับ params เข้ามาและทำการ await ภายใน Suspense
async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <article className="space-y-8">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
            <Layers className="mr-1.5 h-3.5 w-3.5" />
            {project.category}
          </Badge>
          <span className="text-xs font-mono text-slate-500">
            Created: {new Date(project.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {project.title}
        </h1>
      </div>

      {/* Cover Image */}
      {project.image_url ? (
        <div className="w-full h-[300px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-64 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 font-mono">
          [No Cover Image Available]
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-2">
        {project.demo_link && (
          <Button 
            asChild 
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-medium shadow-lg shadow-teal-500/20 h-11 px-6"
          >
            <a href={project.demo_link} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              เข้าชมระบบจริง <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        
        {project.download_link && (
          <Button 
            variant="outline" 
            asChild 
            className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white h-11 px-6"
          >
            <a href={project.download_link} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <GithubIcon className="h-4 w-4" /> ซอร์สโค้ด / รายละเอียด
            </a>
          </Button>
        )}
      </div>

      {/* Description Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-teal-300 font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
          <Terminal className="h-5 w-5" /> รายละเอียดเชิงลึกของโปรเจกต์
        </h2>
        <div className="text-slate-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
          {project.description}
        </div>
      </div>
    </article>
  )
}

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern text-slate-100 relative overflow-x-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar / Navigation */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            asChild 
            className="text-slate-400 hover:text-white hover:bg-slate-900 font-mono text-sm"
          >
            <Link href="/#portfolio">
              <ArrowLeft className="mr-2 h-4 w-4 text-teal-400" /> ย้อนกลับหน้าหลัก
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Terminal className="h-3.5 w-3.5 text-teal-400" />
            <span>dynamic_route</span>
          </div>
        </div>
      </header>

      {/* Main Content with Suspense Boundary enclosing params usage */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 relative z-10">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32 text-teal-400/70 font-mono animate-pulse">
            <Loader2 className="h-10 w-10 mb-4 animate-spin" />
            <span>Loading project details...</span>
          </div>
        }>
          <ProjectDetail params={params} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 mt-16 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto max-w-5xl px-4 text-center text-slate-500 text-sm font-mono">
          <p>© 2026 Chinnawat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}