import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface CarModel {
  id: string
  label: string
  brand_label: string
  brand_id: string
  status: 'Pas encore' | 'En cours' | 'Terminé' | 'Hors cible' | 'À ne pas générer'
  commentaire: string
  collaborateur: 'Ayoub KHYATI' | 'Ayoub MARAHRAN' | 'Zakaria ELFOUNDY' | 'Nouhaila MESLAOUI' | 'Sanaa ABRIL' | null
  created_at: string
  updated_at: string
}

export const STATUS_OPTIONS = [
  'Pas encore',
  'En cours', 
  'Terminé',
  'Hors cible',
  'À ne pas générer'
] as const

export const COLLABORATEUR_OPTIONS = [
  'Ayoub KHYATI',
  'Ayoub MARAHRAN', 
  'Zakaria ELFOUNDY',
  'Nouhaila MESLAOUI',
  'Sanaa ABRIL'
] as const