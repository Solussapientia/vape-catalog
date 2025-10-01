import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  puffs: string
  price: string
  image_name: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface Flavor {
  id: string
  product_id: string
  name: string
  in_stock: boolean
  description?: string
  created_at?: string
  updated_at?: string
}

export interface VapeProduct extends Product {
  flavors: Flavor[]
} 