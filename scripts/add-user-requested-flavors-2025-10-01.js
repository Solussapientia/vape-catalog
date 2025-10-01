// Adds requested flavors as in-stock across multiple products
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const flavorsByProduct = {
  // Geek Bar Pulse
  pulse: [
    'sparkling lemon mint',
    'nectarine ice',
    // Also provided under GEEK BAR PULSE block (de-dup protected)
    'sparkling lemon wine',
  ],
  // VIHO 50k (TRX 50K id in this codebase)
  viho_trx_50k: [
    'grape ice',
    'icy mint',
  ],
  // Lost Mary 5K (MO5000 id)
  mo5000: [
    'Ice peach colada',
    'lemon sparkling wine',
  ],
  // RAZZ 9K — using razz_mega for 9K/25K entries per existing scripts
  razz_mega: [
    'Cherry Lemmon',
  ],
}

async function upsertFlavors(productId, flavorNames) {
  // Normalize for duplicate protection
  const { data: existing, error } = await supabase
    .from('flavors')
    .select('id,name')
    .eq('product_id', productId)
  if (error) throw error

  const existingMap = new Map((existing || []).map((f) => [f.name.toLowerCase().trim(), f]))

  let added = 0
  for (const nameRaw of flavorNames) {
    const name = (nameRaw || '').trim()
    if (!name) continue
    const key = name.toLowerCase()
    const found = existingMap.get(key)
    if (found) {
      // Ensure in_stock is true
      const { error: updErr } = await supabase
        .from('flavors')
        .update({ in_stock: true })
        .eq('id', found.id)
      if (updErr) {
        console.error(`  ❌ Update failed for ${productId} → ${name}:`, updErr.message)
      } else {
        console.log(`  🔄 Set in stock: ${name}`)
        added++
      }
    } else {
      const { error: insErr } = await supabase
        .from('flavors')
        .insert({ product_id: productId, name, in_stock: true })
      if (insErr) {
        console.error(`  ❌ Insert failed for ${productId} → ${name}:`, insErr.message)
      } else {
        console.log(`  ✅ Added: ${name}`)
        added++
      }
    }
  }
  return added
}

async function run() {
  try {
    let total = 0
    for (const [productId, list] of Object.entries(flavorsByProduct)) {
      console.log(`\nProcessing ${productId}...`)
      total += await upsertFlavors(productId, list)
    }
    console.log(`\n✅ Done. Total flavors added/updated: ${total}`)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


