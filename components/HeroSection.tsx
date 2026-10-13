"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimationFrame } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const floatingCodes = [
  { text: "{}", color: "text-teal-500/40", size: "text-6xl md:text-8xl", blur: "blur-[0.5px]" },
  { text: "</>", color: "text-indigo-500/40", size: "text-6xl md:text-8xl", blur: "blur-[0px]" },
  { text: "[]", color: "text-blue-500/40", size: "text-5xl md:text-7xl", blur: "blur-[1px]" },
  { text: "=>", color: "text-cyan-500/40", size: "text-4xl md:text-6xl", blur: "blur-[0px]" },
  { text: "();", color: "text-emerald-500/40", size: "text-5xl", blur: "blur-[0.5px]" },
  { text: "/* */", color: "text-sky-500/30", size: "text-4xl", blur: "blur-[1.5px]" },
  { text: "import", color: "text-fuchsia-500/30", size: "text-3xl md:text-4xl", blur: "blur-[1px]" },
  { text: "SELECT", color: "text-teal-500/30", size: "text-2xl md:text-3xl", blur: "blur-[1.5px]" },
  { text: "const", color: "text-indigo-500/30", size: "text-4xl", blur: "blur-[0.5px]" },
  { text: "npm run", color: "text-blue-500/30", size: "text-2xl", blur: "blur-[2px]" },
  { text: "&&", color: "text-purple-500/30", size: "text-5xl", blur: "blur-[0px]" },
]

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  speed: number
  rotation: number
  rotationSpeed: number
  opacity: number
  targetVx: number
  targetVy: number
  directionTimer: number
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomDirection() {
  const angle = Math.random() * Math.PI * 2
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  }
}

function createParticle(): Particle {
  const direction = randomDirection()
  return {
    x: randomRange(5, 95),
    y: randomRange(5, 95),
    vx: direction.x,
    vy: direction.y,
    targetVx: direction.x,
    targetVy: direction.y,
    speed: randomRange(20, 60),
    rotation: randomRange(-180, 180),
    rotationSpeed: randomRange(-25, 25),
    opacity: randomRange(0.25, 0.75),
    directionTimer: randomRange(1, 4),
  }
}

function FloatingCode({
  item,
  mousePosRef,
}: {
  item: (typeof floatingCodes)[number]
  mousePosRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  // สร้าง particle ทันทีโดยไม่ต้องรอ useEffect เพื่อป้องกันการกระพริบที่กลางจอตอนโหลด
  const particleRef = useRef<Particle>(createParticle())

  useAnimationFrame((_, delta) => {
    const element = elementRef.current
    const particle = particleRef.current
    if (!element) return

    const parent = element.parentElement
    if (!parent) return

    const width = parent.clientWidth
    const height = parent.clientHeight
    if (!width || !height) return

    const dt = Math.min(delta / 1000, 0.04)
    particle.directionTimer -= dt

    // สุ่มเปลี่ยนทิศทางอิสระ
    if (particle.directionTimer <= 0) {
      const direction = randomDirection()
      particle.targetVx = direction.x
      particle.targetVy = direction.y
      particle.speed = randomRange(20, 60)
      particle.rotationSpeed = randomRange(-30, 30)
      particle.opacity = randomRange(0.2, 0.75)
      particle.directionTimer = randomRange(1.5, 4.5)
    }

    // สมูทการเปลี่ยนทิศทาง
    const steering = Math.min(dt * 1.2, 1)
    particle.vx += (particle.targetVx - particle.vx) * steering
    particle.vy += (particle.targetVy - particle.vy) * steering

    const magnitude = Math.hypot(particle.vx, particle.vy) || 1
    particle.vx /= magnitude
    particle.vy /= magnitude

    // คำนวณตำแหน่งพื้นฐาน
    let finalVx = particle.vx
    let finalVy = particle.vy

    // เพิ่มเอฟเฟกต์ผลักตัวหนังสือหนีเมาส์เบาๆ (Mouse Repel) เมื่อเมาส์อยู่ในพื้นที่
    if (mousePosRef.current.active) {
      const rect = element.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      
      const elementCenterX = rect.left + rect.width / 2 - parentRect.left
      const elementCenterY = rect.top + rect.height / 2 - parentRect.top

      const dx = elementCenterX - mousePosRef.current.x
      const dy = elementCenterY - mousePosRef.current.y
      const dist = Math.hypot(dx, dy)
      const repelRadius = 220 // รัศมีที่จะส่งผลกระทบต่อเมาส์

      if (dist < repelRadius && dist > 0) {
        const force = (1 - dist / repelRadius) * 2.5
        finalVx += (dx / dist) * force
        finalVy += (dy / dist) * force
      }
    }

    particle.x += (finalVx * particle.speed * dt / width) * 100
    particle.y += (finalVy * particle.speed * dt / height) * 100
    particle.rotation += particle.rotationSpeed * dt

    // ตรวจสอบขอบจอเพื่อสุ่มเกิดใหม่จากฝั่งตรงข้าม
    const marginX = (element.offsetWidth / width) * 50 + 5
    const marginY = (element.offsetHeight / height) * 50 + 5

    const outside =
      particle.x < -marginX ||
      particle.x > 100 + marginX ||
      particle.y < -marginY ||
      particle.y > 100 + marginY

    if (outside) {
      const edge = Math.floor(Math.random() * 4)
      if (edge === 0) {
        particle.x = randomRange(0, 100)
        particle.y = -marginY
      } else if (edge === 1) {
        particle.x = 100 + marginX
        particle.y = randomRange(0, 100)
      } else if (edge === 2) {
        particle.x = randomRange(0, 100)
        particle.y = 100 + marginY
      } else {
        particle.x = -marginX
        particle.y = randomRange(0, 100)
      }

      const direction = randomDirection()
      particle.vx = direction.x
      particle.vy = direction.y
      particle.targetVx = direction.x
      particle.targetVy = direction.y
      particle.speed = randomRange(20, 60)
      particle.rotation = randomRange(-180, 180)
      particle.rotationSpeed = randomRange(-30, 30)
      particle.opacity = randomRange(0.2, 0.75)
      particle.directionTimer = randomRange(1, 3)
    }

    // อัปเดต DOM โดยตรงเพื่อความลื่นไหลสูงสุด
    element.style.left = `${particle.x}%`
    element.style.top = `${particle.y}%`
    element.style.transform = `translate(-50%, -50%) rotate(${particle.rotation}deg)`
    element.style.opacity = String(particle.opacity)
  })

  return (
    <div
      ref={elementRef}
      className={`absolute font-mono font-bold select-none whitespace-nowrap pointer-events-none ${item.color} ${item.size} ${item.blur}`}
      style={{
        left: `${particleRef.current.x}%`,
        top: `${particleRef.current.y}%`,
        opacity: particleRef.current.opacity,
        willChange: "left, top, transform, opacity",
      }}
    >
      {item.text}
    </div>
  )
}

export function HeroSection() {
  const [ready, setReady] = useState(false)
  const mousePosRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    setReady(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }

  const handleMouseLeave = () => {
    mousePosRef.current.active = false
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden min-h-[80vh]"
    >
      {/* เอฟเฟกต์แสงพื้นหลัง */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* โค้ดลอยแบบสุ่มอิสระ พร้อมระบบตอบสนองต่อเมาส์ */}
      {ready && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {floatingCodes.map((item, index) => (
            <FloatingCode key={index} item={item} mousePosRef={mousePosRef} />
          ))}
        </div>
      )}

      {/* กล่อง Terminal ด้านขวาบน */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-32 right-10 hidden lg:block glass-panel p-3 rounded-lg w-64 text-left border border-slate-700/50 z-10"
      >
        <div className="flex gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <p className="text-xs font-mono text-teal-400">
          $ chinnawat ~ whoami
        </p>
        <p className="text-xs font-mono text-slate-300">
          Software & Web Developer
        </p>
      </motion.div>

      {/* หัวข้อหลัก */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight">
          สวัสดีครับ, <br className="sm:hidden" />
          ผม{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 neon-text">
            ชินวัตร (CHINNAWAT)
          </span>
        </h1>
      </motion.div>

      {/* คำอธิบาย */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10"
      >
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 px-2">
          แฟ้มสะสมผลงานด้านการพัฒนาเว็บไซต์ แอปพลิเคชัน และระบบจัดการฐานข้อมูล
        </p>
      </motion.div>

      {/* ปุ่ม */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4"
      >
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto rounded-full px-8 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white border-0 neon-shadow h-12 text-md"
        >
          <a href="#portfolio">
            ดูผลงานทั้งหมด <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full sm:w-auto rounded-full px-8 border-teal-500/50 text-teal-400 hover:bg-teal-950 hover:text-teal-300 glass-panel h-12 text-md"
        >
          <a href="#contact">ติดต่อฉัน</a>
        </Button>
      </motion.div>
    </section>
  )
}