// Adds flavors to Viho Supercharge and Supercharge Pro as in stock
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function upsertFlavors(productId, flavors) {
  // Fetch existing to avoid duplicates
  const { data: existing, error } = await supabase
    .from('flavors')
    .select('name')
    .eq('product_id', productId)
  if (error) throw error
  const existingSet = new Set((existing || []).map((f) => (f.name || '').toLowerCase()))
  const rows = flavors
    .filter((n) => !existingSet.has(n.toLowerCase()))
    .map((name) => ({ product_id: productId, name, in_stock: true }))
  if (rows.length === 0) return 0
  const { error: insertErr } = await supabase.from('flavors').insert(rows)
  if (insertErr) throw insertErr
  return rows.length
}

async function run() {
  try {
    const added1 = await upsertFlavors('viho_s', ['crispy apple berry'])
    const added2 = await upsertFlavors('viho_sp', ['strawberry lemonade', 'watermelon rollz', 'clear'])
    console.log(`Added ${added1} to viho_s and ${added2} to viho_sp`)
  } catch (e) {
    console.error('Error adding flavors:', e)
    process.exit(1)
  }
}

run()


