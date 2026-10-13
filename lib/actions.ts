import { supabase } from './supabase';
import { connection } from 'next/server';

// ฟังก์ชันสำหรับดึงผลงานทั้งหมดจากตาราง projects
export async function getProjects() {
  // บังคับให้ Next.js รู้ว่านี่คือข้อมูลแบบไดนามิก (ไม่ต้องแคช)
  await connection();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data;
}