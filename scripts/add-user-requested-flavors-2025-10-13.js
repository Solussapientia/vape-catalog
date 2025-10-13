// Adds requested flavors for UT and Fogger switch pod as in-stock (no duplicates)
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function normalizeFlavor(name) {
  return (name || '').trim().replace(/\s+/g, ' ').replace(/\s*\/\s*/g, ' & ')
}

async function upsertFlavors(productId, flavors) {
  // Ensure product exists
  const { data: product, error: productErr } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .single()
  if (productErr || !product) {
    console.error(`Product not found: ${productId}`)
    return 0
  }

  // Fetch existing flavor names
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
  console.log(`Inserted ${toInsert.length} flavors for ${productId}`)
  return toInsert.length
}

async function run() {
  try {
    let total = 0

    // UT 50K
    const utFlavors = [
      'Naked Spring Water',
      'White Peach & Raspberry',
      'White Peach & Lemon Head',
      'Watermelon B-Pop',
      'Blue Razz Ice & Triple Berry',
      'White Gummy & Cherry',
      'Mango & Strawberry',
      'Banana Smoothy Strawberry',
      'Aloe Grape & Aloe Watermelon',
      'Thai Mango & Juice Peach',
      'Blue Razz & Lemonade',
      'Strawberry & Watermelon Ice',
      'Sour Fab & Citrus Ice',
      'Miami Mint & Mint Slushy',
      'Green Apple & Fuji Apple',
      'Cool Mint & Icy Mint',
    ]
    total += await upsertFlavors('ut_50k', utFlavors)

    // Fogger pods
    const foggerPodFlavors = [
      'Strawberry Banana',
      'Strawberry Ice Cream',
      'Strawberry Cupcake',
      'White Gummy',
      'Kiwi Dragon Berry',
      'Strawberry Kiwi',
      'Sour Apple Ice Cream',
      'Strawberry Watermelon',
      'Blueberry Watermelon',
      'Miami Mint',
      'Juice Peach Ice',
      'Blue Razz',
    ]
    total += await upsertFlavors('fogger_switch_pod', foggerPodFlavors)

    console.log(`\n✅ Done. Total flavors inserted: ${total}`)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


