// Adds new flavors for Fogger kits, Viho TRX 50k, and Fogger pods
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function normalizeFlavor(name) {
  return (name || '').trim().replace(/\s+/g, ' ')
}

async function upsertFlavors(productId, flavors) {
  const { data: product, error: productErr } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .single()
  if (productErr || !product) {
    console.error(`Product not found: ${productId}`)
    return 0
  }

  const { data: existing, error: existingErr } = await supabase
    .from('flavors')
    .select('name')
    .eq('product_id', productId)
  if (existingErr) {
    console.error(`Failed fetching flavors for ${productId}:`, existingErr)
    return 0
  }

  const existingSet = new Set((existing || []).map((f) => (f.name || '').toLowerCase().trim()))
  const toInsert = flavors
    .map(normalizeFlavor)
    .filter((n) => n.length > 0 && !existingSet.has(n.toLowerCase()))
    .map((name) => ({ product_id: productId, name, in_stock: true }))

  if (toInsert.length === 0) {
    console.log(`No new flavors to insert for ${productId}`)
    return 0
  }

  const { error: insertErr } = await supabase.from('flavors').insert(toInsert)
  if (insertErr) {
    console.error(`Insert error for ${productId}:`, insertErr)
    return 0
  }
  console.log(`✅ Inserted ${toInsert.length} flavors for ${productId}`)
  return toInsert.length
}

async function run() {
  try {
    let total = 0

    // Fogger kits
    const foggerKitFlavors = [
      'Coconut cupcake',
      'Strawberry slush',
      'Cherry slush',
      'Hawaiian punch',
      'Triple berry punch',
      'Strawberry b-burst',
      'Sour raspberry punch',
      'Miami mint',
    ]
    total += await upsertFlavors('fogger_switch_pro_kit', foggerKitFlavors)

    // Viho TRX 50k
    const vihoTrxFlavors = [
      'Glazed donut',
      'Pina coco',
    ]
    total += await upsertFlavors('viho_trx_50k', vihoTrxFlavors)

    // Fogger pods
    const foggerPodFlavors = [
      'Strawberry ice',
    ]
    total += await upsertFlavors('fogger_switch_pod', foggerPodFlavors)

    console.log(`\n✅ Done. Total flavors inserted: ${total}`)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()
