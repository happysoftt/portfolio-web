"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageOff, ExternalLink, Code } from "lucide-react"
import { AnimatedCard } from "@/components/AnimatedCard"

export function PortfolioFilter({ projects }: { projects: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  // ดึงหมวดหมู่ที่ไม่ซ้ำกันจากโปรเจกต์ทั้งหมด
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))]

  // กรองโปรเจกต์ตามหมวดหมู่
  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

  return (
    <div>
      {/* แท็บปุ่มกดเลือกหมวดหมู่ */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-mono transition-all duration-300 border ${
              selectedCategory === category
                ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_0_20px_rgba(45,212,191,0.25)]"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* กริดแสดงการ์ดผลงาน */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProjects.map((project: any, index: number) => (
          <AnimatedCard key={project.id} index={index}>
            <Card className="flex flex-col h-full overflow-hidden hover:shadow-[0_0_35px_rgba(45,212,191,0.2)] transition-all duration-500 bg-slate-900/50 backdrop-blur-xl border-slate-800/80 group">
              <div className="h-48 sm:h-56 bg-slate-950 relative w-full overflow-hidden border-b border-slate-800/80 group">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-slate-600 font-mono text-sm">
                    <ImageOff className="h-10 w-10 mb-3 opacity-50" />
                    [No Image Available]
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              </div>
              
              <CardHeader className="relative z-10 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/20 font-mono text-xs">
                    {project.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl text-slate-100 group-hover:text-teal-300 transition-colors">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              
              <CardFooter className="mt-auto pt-4 flex flex-col sm:flex-row gap-2 w-full border-t border-slate-800/50 bg-slate-900/30">
                {/* ปุ่มดูรายละเอียดระบบ (วิ่งเข้าหน้า Dynamic Route ของโปรเจกต์นั้นๆ) */}
                <Button variant="default" className="w-full sm:flex-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-colors h-10 font-medium" asChild>
                  <Link href={`/projects/${project.id}`}>ดูรายละเอียดระบบ</Link>
                </Button>
                
                {/* ปุ่มลิงก์ภายนอก / ดาวน์โหลด (แสดงเฉพาะเมื่อมีข้อมูลลิงก์) */}
                {project.download_link && (
                  <Button variant="outline" className="w-full sm:flex-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors h-10 font-medium" asChild>
                    <a href={project.download_link} target="_blank" rel="noreferrer">ลิงก์ภายนอก</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}