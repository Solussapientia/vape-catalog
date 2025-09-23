// Inserts/updates ROMO device with flavors; attempts to position under Geek Bar Pulse
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'romo'

  // Try to fetch Geek Bar Pulse to place ROMO directly after it
  let createdAt = new Date().toISOString()
  try {
    const { data: pulse } = await supabase
      .from('products')
      .select('*')
      .eq('id', 'pulse')
      .single()
    if (pulse && pulse.created_at) {
      const plusOneMs = new Date(new Date(pulse.created_at).getTime() + 1)
      createdAt = plusOneMs.toISOString()
    }
  } catch (_) {}

  const product = {
    id: productId,
    name: 'ROMO',
    // We will show "Comes with 5" in UI instead of puffs text
    puffs: '',
    price: '$15.00',
    image_name: '3o0gu.webp',
    created_at: createdAt,
  }

  const flavors = [
    'Strawberry watermelon',
    'Butter tobacco',
    'Strawberry kiwi',
    'Blue razz',
    'Sour pink lemonade',
    'Juicy peach',
    'Sour apple',
    'Miami mint',
    'Mint',
    'Watermelon ice',
  ]

  try {
    console.log('Upserting product:', product.name)
    const { error: upsertProductError } = await supabase
      .from('products')
      .upsert(product)

    if (upsertProductError) {
      console.error('Product upsert failed:', upsertProductError)
      process.exit(1)
    }

    // Clean existing flavors for idempotency
    await supabase.from('flavors').delete().eq('product_id', productId)

    const rows = flavors.map((name) => ({ product_id: productId, name, in_stock: true }))
    console.log(`Inserting ${rows.length} flavors...`)
    const { error: insertFlavorsError } = await supabase
      .from('flavors')
      .insert(rows)

    if (insertFlavorsError) {
      console.error('Flavor insert failed:', insertFlavorsError)
      process.exit(1)
    }

    console.log('✅ ROMO inserted/updated successfully.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


