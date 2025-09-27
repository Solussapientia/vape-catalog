// Upsert flavors requested on 2025-09-27
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Map of product_id -> flavor names to add/update as in stock
const flavorsByProduct = {
  // VIHO 50K (TRX)
  viho_trx_50k: ['grape ice', 'icy mint'],
  // Geek Bar Pulse
  pulse: ['sparkling lemon wine', 'nectarine ice'],
  // Lost Mary 5K (MO5000)
  mo5000: ['Ice peach colada', 'lemon sparkling wine'],
  // Razz 9K -> Razz Mega container
  razz_mega: ['Cherry Lemmon'],
}

async function ensureProduct(productId) {
  const { data } = await supabase.from('products').select('id').eq('id', productId).single()
  return !!data
}

async function upsertFlavor(productId, name) {
  const { data: existing } = await supabase
    .from('flavors')
    .select('id,in_stock')
    .eq('product_id', productId)
    .eq('name', name)
    .maybeSingle()

  if (existing && existing.id) {
    if (!existing.in_stock) {
      await supabase.from('flavors').update({ in_stock: true }).eq('id', existing.id)
      console.log(`  ✓ Updated in stock: ${name}`)
    } else {
      console.log(`  • Already present: ${name}`)
    }
    return
  }

  const { error } = await supabase.from('flavors').insert({ product_id: productId, name, in_stock: true })
  if (error) {
    console.log(`  ✗ Insert failed for ${name}: ${error.message}`)
  } else {
    console.log(`  ✓ Inserted: ${name}`)
  }
}

async function run() {
  try {
    for (const [productId, list] of Object.entries(flavorsByProduct)) {
      const ok = await ensureProduct(productId)
      if (!ok) {
        console.log(`Skipping ${productId} (product not found)`) 
        continue
      }
      console.log(`\nAdding flavors for ${productId}:`)
      for (const name of list) {
        await upsertFlavor(productId, name)
      }
    }
    console.log('\nDone adding 2025-09-27 requested flavors.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


