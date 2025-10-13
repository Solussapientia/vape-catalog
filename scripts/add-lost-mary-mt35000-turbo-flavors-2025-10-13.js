// Adds flavors for Lost Mary MT35000 Turbo as in-stock, avoiding duplicates
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'lost_mary_mt35000_turbo'

  // Ensure product exists
  const { data: product, error: productErr } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .single()
  if (productErr || !product) {
    console.error('Product not found:', productId)
    process.exit(1)
  }

  const flavors = [
    'Berry Burst',
    'Winter Mint',
    'Pink Lemonade',
    'White Gami',
    'Tigers Blood',
    'Scary Berry',
    'Orange Passion Mango',
    'Pineapple Lime',
    'Strawberry',
    'Black Mint',
    'Strawberry Kiwi',
    'Summer Grape',
    'Toasted Banana',
    'Watermelon',
    'Blackberry Blueberry',
    'Rocket Freeze',
    'Strawmelon Peach',
    'Baja Splash',
  ]

  // Fetch existing flavors to avoid duplicates
  const { data: existing, error: existingErr } = await supabase
    .from('flavors')
    .select('name')
    .eq('product_id', productId)
  if (existingErr) {
    console.error('Failed to fetch existing flavors:', existingErr)
    process.exit(1)
  }

  const existingSet = new Set((existing || []).map((f) => (f.name || '').toLowerCase().trim()))
  const toInsert = flavors
    .map((n) => (n || '').trim())
    .filter((n) => n.length > 0 && !existingSet.has(n.toLowerCase()))
    .map((name) => ({ product_id: productId, name, in_stock: true }))

  if (toInsert.length === 0) {
    console.log('No new flavors to insert')
    return
  }

  const { error: insertErr } = await supabase.from('flavors').insert(toInsert)
  if (insertErr) {
    console.error('Insert error:', insertErr)
    process.exit(1)
  }

  console.log(`Inserted ${toInsert.length} flavors for ${productId}`)
}

run()


