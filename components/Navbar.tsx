"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full glass-panel border-b-0">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl tracking-tight text-white">
              Portfolio<span className="text-teal-400">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">เกี่ยวกับฉัน</Link>
            <Link href="#portfolio" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">ผลงาน</Link>
            <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">ติดต่อ</Link>
          </nav>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
            <span className="text-xs font-medium text-teal-400">Available for Projects</span>
          </div>
        </div>
      </div>
    </header>
  )
}