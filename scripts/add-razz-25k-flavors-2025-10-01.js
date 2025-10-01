// Adds RAZZ 25K flavors as in stock (mapped to product id 'razz_mega')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const productId = 'razz_mega'
const flavors = [
  'black cherry peach',
  'blueberry watermelon',
  'Tripple berry gush',
  'Tropical gush',
  'strawberry peach gush',
  'Blue raz Gush',
]

async function upsertFlavors() {
  // Fetch existing flavors to avoid duplicates and set in_stock
  const { data: existing, error } = await supabase
    .from('flavors')
    .select('id,name')
    .eq('product_id', productId)
  if (error) throw error

  const existingMap = new Map((existing || []).map((f) => [String(f.name || '').toLowerCase().trim(), f]))

  let updatedCount = 0
  for (const rawName of flavors) {
    const name = (rawName || '').trim()
    if (!name) continue
    const key = name.toLowerCase()
    const found = existingMap.get(key)
    if (found) {
      const { error: updErr } = await supabase
        .from('flavors')
        .update({ in_stock: true })
        .eq('id', found.id)
      if (updErr) {
        console.error(`❌ Update failed for ${name}:`, updErr.message)
      } else {
        console.log(`🔄 Set in stock: ${name}`)
        updatedCount++
      }
    } else {
      const { error: insErr } = await supabase
        .from('flavors')
        .insert({ product_id: productId, name, in_stock: true })
      if (insErr) {
        console.error(`❌ Insert failed for ${name}:`, insErr.message)
      } else {
        console.log(`✅ Added: ${name}`)
        updatedCount++
      }
    }
  }

  console.log(`\nDone. Total flavors added/updated: ${updatedCount}`)
}

upsertFlavors().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})


