// Inserts/updates Geek Bar Pulse X 2; positions directly above Geek Bar Pulse X
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'pulse_x_2'

  let createdAt = '1988-06-01T00:00:00.000Z'
  try {
    const { data: pulseX } = await supabase
      .from('products')
      .select('created_at')
      .eq('id', 'pulse_x')
      .single()
    if (pulseX && pulseX.created_at) {
      const minusOneMs = new Date(new Date(pulseX.created_at).getTime() - 1)
      createdAt = minusOneMs.toISOString()
    }
  } catch (_) {}

  const product = {
    id: productId,
    name: 'Geek Bar Pulse X 2',
    puffs: '50,000',
    price: '$35',
    image_name: '282828.webp',
    created_at: createdAt,
  }

  const flavors = [
    'Watermelon Bull',
    'Strawberry Bull',
    'Blue Razz Bull',
    'Peach Bull',
    'Coco Berry Bull',
  ]

  try {
    console.log('Upserting product:', product.name)
    const { error: upsertProductError } = await supabase.from('products').upsert(product)
    if (upsertProductError) {
      console.error('Product upsert failed:', upsertProductError)
      process.exit(1)
    }

    await supabase.from('flavors').delete().eq('product_id', productId)

    const rows = flavors.map((name) => ({ product_id: productId, name, in_stock: true }))
    console.log(`Inserting ${rows.length} flavors...`)
    const { error: insertFlavorsError } = await supabase.from('flavors').insert(rows)
    if (insertFlavorsError) {
      console.error('Flavor insert failed:', insertFlavorsError)
      process.exit(1)
    }

    console.log('✅ Geek Bar Pulse X 2 inserted/updated successfully.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()
