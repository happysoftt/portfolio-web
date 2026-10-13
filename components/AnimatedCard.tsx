"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function AnimatedCard({ children, index }: { children: ReactNode, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}