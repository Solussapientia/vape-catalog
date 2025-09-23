// Add user-requested flavors across multiple products (all in stock)
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const flavorsByProduct = {
  fogger_switch_pod: [
    'White gummy',
  ],
  viho_trx_50k: [
    'Hawaiian Punch',
    'Strawmelon ice',
    'Cola slurpee',
    'Peachy peach',
    'Menthol',
  ],
  ria: [
    'Watermelon b-burst',
  ],
  adjust: [
    'Miami mint',
  ],
  ltx: [
    'New York mint',
    'Triple Berry punch',
    'White grape gush',
  ],
  // 0 nic Raz -> using RYL Classic (ryl) as container until a dedicated product exists
  ryl: [
    'Blueberry watermelon',
    'Strawberry burst',
    'Bangin sour berries',
    'New York mint',
    'Miami mint',
  ],
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
    console.log('\nDone adding requested flavors.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


