import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type FlavorSpec = Record<string, string[]>

// Requested additions (all in stock)
const flavors: FlavorSpec = {
  // Fogger pod
  fogger_switch_pod: [
    'White gummy',
  ],

  // TRX 50K
  viho_trx_50k: [
    'Hawaiian Punch',
    'Strawmelon ice',
    'Cola slurpee',
    'Peachy peach',
    'Menthol',
  ],

  // Ria
  ria: [
    'Watermelon b-burst',
  ],

  // Adjust
  adjust: [
    'Miami mint',
  ],

  // Razz LTX
  ltx: [
    'New York mint',
    'Triple Berry punch',
    'White grape gush',
  ],

  // 0 nic Raz — mapped to RYL Classic by RAZZ (id: ryl)
  // If a dedicated 0-nic product is added later, update the ID here
  ryl: [
    'Blueberry watermelon',
    'Strawberry burst',
    'Bangin sour berries',
    'New York mint',
    'Miami mint',
  ],
}

async function upsertFlavor(productId: string, name: string) {
  // Check if exists
  const { data: existing } = await supabase
    .from('flavors')
    .select('id,in_stock')
    .eq('product_id', productId)
    .eq('name', name)
    .maybeSingle()

  if (existing?.id) {
    // Ensure marked in stock
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
    console.error(`  ✗ Insert failed for ${name}:`, error.message)
  } else {
    console.log(`  ✓ Inserted: ${name}`)
  }
}

async function run() {
  let total = 0
  for (const [productId, flvs] of Object.entries(flavors)) {
    // Verify product exists
    const { data: product } = await supabase.from('products').select('id').eq('id', productId).single()
    if (!product) {
      console.warn(`Product not found: ${productId} — skipping`)
      continue
    }
    console.log(`\nAdding flavors for ${productId}:`)
    for (const name of flvs) {
      await upsertFlavor(productId, name)
      total++
    }
  }
  console.log(`\nDone. Processed ${total} flavor operations.`)
}

run()


