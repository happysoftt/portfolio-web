"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImagePlus, Loader2, Pencil, Trash2, LogOut, ExternalLink, ShieldCheck, Sparkles } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [demoLink, setDemoLink] = useState('')
  const [downloadLink, setDownloadLink] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      fetchProjects()
    }
    checkUserAndFetchData()
  }, [router])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setDemoLink('')
    setDownloadLink('')
    setImageFile(null)
    setPreviewUrl('')
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setTitle(project.title)
    setDescription(project.description)
    setCategory(project.category)
    setDemoLink(project.demo_link || '')
    setDownloadLink(project.download_link || '')
    setPreviewUrl(project.image_url || '')
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm('ต้องการลบผลงานนี้ใช่หรือไม่?')) return

    try {
      if (imageUrl) {
        const filePath = imageUrl.split('/').pop()
        if (filePath) {
          await supabase.storage.from('project-images').remove([`covers/${filePath}`])
        }
      }
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      
      fetchProjects()
    } catch (error: any) {
      alert("เกิดข้อผิดพลาดในการลบ: " + error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    let imageUrl = previewUrl 

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `covers/${fileName}`

        const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, imageFile)
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('project-images').getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }

      const projectData = { 
        title, 
        description, 
        category,
        demo_link: demoLink || null,
        download_link: downloadLink || null,
        image_url: imageUrl || null
      }

      if (editingId) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert([projectData])
        if (error) throw error
      }

      resetForm()
      fetchProjects()
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-teal-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                ระบบจัดการผลงาน <Sparkles className="h-4 w-4 text-teal-400" />
              </h1>
              <p className="text-xs md:text-sm text-slate-400">จัดการข้อมูลโปรเจกต์และแฟ้มสะสมผลงานของคุณ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white transition-all flex-1 sm:flex-none"
            >
              <ExternalLink className="mr-2 h-4 w-4 text-teal-400" /> ดูหน้าเว็บหลัก
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 transition-all"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800 shadow-2xl text-slate-100">
            <CardHeader className="border-b border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-bold text-teal-300 flex items-center gap-2">
                {editingId ? <Pencil className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
                {editingId ? 'แก้ไขข้อมูลผลงาน' : 'เพิ่มผลงานใหม่'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <Label className="text-slate-300 font-medium">ภาพหน้าปกผลงาน (Cover Image)</Label>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div 
                      className="w-full md:w-72 h-44 border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-xl flex items-center justify-center bg-slate-950/50 overflow-hidden cursor-pointer transition-all relative group shadow-inner"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-teal-300 text-sm font-medium gap-2">
                            <ImagePlus className="h-5 w-5" /> เปลี่ยนรูปภาพ
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-slate-400 flex flex-col items-center p-4">
                          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-full mb-2 group-hover:scale-110 transition-transform">
                            <ImagePlus className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium text-slate-300">คลิกเพื่ออัปโหลดรูปภาพ</span>
                          <span className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP (แนะนำสัดส่วน 16:9)</span>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300 font-medium">ชื่อผลงาน *</Label>
                    <Input 
                      id="title" 
                      required 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="เช่น E-Commerce Platform"
                      className="bg-slate-950/60 border-slate-800 focus:border-teal-500 text-slate-100 placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-300 font-medium">หมวดหมู่ *</Label>
                    <Input 
                      id="category" 
                      required 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      placeholder="เช่น Full Stack, Web App"
                      className="bg-slate-950/60 border-slate-800 focus:border-teal-500 text-slate-100 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300 font-medium">รายละเอียดโปรเจกต์ *</Label>
                  <Textarea 
                    id="description" 
                    required 
                    rows={4} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="อธิบายรายละเอียดความสามารถ เทคโนโลยีที่ใช้ และจุดเด่นของผลงาน..."
                    className="bg-slate-950/60 border-slate-800 focus:border-teal-500 text-slate-100 placeholder:text-slate-600 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="demoLink" className="text-slate-300 font-medium">ลิงก์ดูผลงานจริง (Demo URL)</Label>
                    <Input 
                      id="demoLink" 
                      type="url" 
                      value={demoLink} 
                      onChange={(e) => setDemoLink(e.target.value)} 
                      placeholder="https://example.com"
                      className="bg-slate-950/60 border-slate-800 focus:border-teal-500 text-slate-100 placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downloadLink" className="text-slate-300 font-medium">ลิงก์ดาวน์โหลดโค้ด/รายงาน (Source Code)</Label>
                    <Input 
                      id="downloadLink" 
                      type="url" 
                      value={downloadLink} 
                      onChange={(e) => setDownloadLink(e.target.value)} 
                      placeholder="https://github.com/..."
                      className="bg-slate-950/60 border-slate-800 focus:border-teal-500 text-slate-100 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button 
                    type="submit" 
                    disabled={submitting} 
                    className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-medium shadow-lg shadow-teal-500/20 h-11"
                  >
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มผลงานใหม่')}
                  </Button>
                  {editingId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 h-11"
                    >
                      ยกเลิก
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project List Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800 shadow-2xl text-slate-100">
            <CardHeader className="border-b border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-bold text-teal-300">ผลงานทั้งหมดในระบบ ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-semibold rounded-tl-xl">รูปภาพ</th>
                      <th className="p-4 font-semibold">ชื่อผลงาน</th>
                      <th className="p-4 font-semibold">หมวดหมู่</th>
                      <th className="p-4 font-semibold text-right rounded-tr-xl">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          ยังไม่มีข้อมูลผลงานในระบบ เพิ่มผลงานแรกของคุณได้เลยด้านบน
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                            {project.image_url ? (
                              <img src={project.image_url} alt={project.title} className="w-16 h-12 object-cover rounded-lg border border-slate-800 shadow-sm" />
                            ) : (
                              <div className="w-16 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400 border border-slate-700">ไม่มีรูป</div>
                            )}
                          </td>
                          <td className="p-4 font-medium text-slate-200">{project.title}</td>
                          <td className="p-4">
                            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
                              {project.category}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(project)}
                              className="text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10" 
                              onClick={() => handleDelete(project.id, project.image_url)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}