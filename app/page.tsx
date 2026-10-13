import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { SkillsSection } from "@/components/SkillsSection"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects } from "@/lib/actions"
import { Suspense } from "react"
import { ImageOff, Loader2, Terminal, ExternalLink, Code2 } from "lucide-react"
import { AnimatedCard } from "@/components/AnimatedCard"
import { PortfolioFilter } from "@/components/PortfolioFilter" // แยกคอมโพเนนต์ Filter ฝั่ง Client

async function PortfolioContent() {
  const projects = await getProjects()

  if (projects.length === 0) {
    return (
      <div className="col-span-full text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
        <Terminal className="h-10 w-10 mx-auto mb-3 text-slate-600" />
        <p className="text-slate-400 font-mono text-sm">No records found in database.</p>
      </div>
    )
  }

  return <PortfolioFilter projects={projects} />
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern relative text-slate-100 overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <HeroSection />
        <SkillsSection />

        <section id="portfolio" className="py-20 md:py-28 border-t border-slate-800/60 relative">
          {/* แสงเรืองตกแต่งหัวข้อพอร์ตโฟลิโอ */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-[1px] bg-gradient-to-r from-transparent via-teal-500/60 to-transparent"></div>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="text-center mb-12 md:mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono mb-3">
              <Code2 className="h-3.5 w-3.5" /> MY PROJECTS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              ผลงานที่ผ่านมา <span className="text-teal-400">.</span>
            </h2>
            <p className="text-slate-400 font-mono text-xs sm:text-sm flex items-center justify-center gap-2">
               <Terminal className="h-4 w-4 text-teal-400" />
               {`SELECT * FROM projects ORDER BY created_at DESC;`}
            </p>
          </div>
          
          <Suspense fallback={
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-teal-400/70 font-mono animate-pulse">
              <Loader2 className="h-10 w-10 mb-4 animate-spin" />
              <span>Fetching Data from server...</span>
            </div>
          }>
            <PortfolioContent />
          </Suspense>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-800/60 py-12 mt-16 relative overflow-hidden bg-slate-950/80 backdrop-blur-md">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-teal-900/10 to-transparent -z-10"></div>
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
          <p>© 2026 Chinnawat. All rights reserved.</p>
          <p className="mt-4 md:mt-0 font-mono flex items-center justify-center gap-2">
            System Status: <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span> Online
          </p>
        </div>
      </footer>
    </div>
  );
}