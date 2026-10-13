"use client"

import { motion } from "framer-motion"

const skills = [
  {
    num: "01",
    title: "Back-end & Programming",
    border: "border-blue-500/40 hover:border-blue-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    bg: "from-blue-500/10 to-transparent",
    content: (
      <div className="font-mono text-xs text-blue-300/70 p-4 bg-slate-900/50 rounded-md mt-4 border border-slate-800">
        <span className="text-pink-400">import</span> sys<br/>
        <span className="text-blue-400">def</span> <span className="text-yellow-200">init_server</span>():<br/>
        &nbsp;&nbsp;console.log(<span className="text-green-300">"Ready"</span>)
      </div>
    )
  },
  {
    num: "02",
    title: "Database Design",
    border: "border-teal-500/40 hover:border-teal-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]",
    bg: "from-teal-500/10 to-transparent",
    content: (
      <div className="flex flex-col items-center justify-center h-24 mt-4 opacity-70">
        <div className="w-16 h-4 border-2 border-teal-500 rounded-[50%] bg-teal-950/50 mb-[-8px] z-20"></div>
        <div className="w-16 h-12 border-x-2 border-teal-500 bg-teal-900/20 z-10 flex items-center justify-center">
          <span className="text-[10px] font-mono text-teal-300">SQL / ER</span>
        </div>
        <div className="w-16 h-4 border-2 border-teal-500 rounded-[50%] bg-teal-900/50 mt-[-8px] z-20"></div>
      </div>
    )
  },
  {
    num: "03",
    title: "Web Development",
    border: "border-indigo-500/40 hover:border-indigo-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
    bg: "from-indigo-500/10 to-transparent",
    content: (
      <div className="flex gap-2 h-24 mt-4">
        <div className="flex-1 bg-slate-900/80 rounded-md border border-slate-800 flex items-center justify-center font-bold text-white">NEXT<span className="text-xs font-normal">.js</span></div>
        <div className="flex-1 bg-slate-900/80 rounded-md border border-slate-800 flex items-center justify-center font-bold text-blue-400 text-2xl">W</div>
      </div>
    )
  },
  {
    num: "04",
    title: "UI/UX & Tools",
    border: "border-rose-500/40 hover:border-rose-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
    bg: "from-rose-500/10 to-transparent",
    content: (
      <div className="h-24 mt-4 bg-slate-900/80 rounded-md border border-slate-800 p-2 flex flex-col gap-2">
        <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div><div className="w-12 h-2 rounded bg-slate-700"></div></div>
        <div className="flex gap-2"><div className="w-full h-8 rounded bg-slate-800"></div><div className="w-8 h-8 rounded bg-slate-800"></div></div>
      </div>
    )
  }
]

export function SkillsSection() {
  return (
    <section id="about" className="py-20">
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-10 px-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">Skills <span className="text-slate-400 text-xl font-normal ml-2">ทักษะความเชี่ยวชาญ</span></h2>
        <div className="hidden md:block h-[1px] flex-1 bg-gradient-to-r from-slate-700 to-transparent mb-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`h-64 rounded-xl glass-panel border ${skill.border} p-6 flex flex-col relative overflow-hidden group transition-all duration-500 ${skill.glow}`}>
              {/* แถบ Gradient ด้านบน */}
              <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${skill.bg} opacity-50`}></div>
              
              <div className="z-10 flex gap-3 items-center mb-4">
                <span className="text-xl font-bold text-teal-400/50 group-hover:text-teal-400 transition-colors">{skill.num}</span>
                <span className="text-slate-600">/</span>
                <h3 className="font-semibold text-md text-slate-200 leading-tight">{skill.title}</h3>
              </div>
              
              {/* พื้นที่โชว์ของจำลอง */}
              <div className="z-10 flex-1">
                {skill.content}
              </div>
              
              {/* แถบเส้นด้านล่าง */}
              <div className="absolute bottom-4 left-6 right-6 h-[2px] bg-gradient-to-r from-teal-500/50 to-transparent rounded-full group-hover:from-teal-400 transition-colors"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}