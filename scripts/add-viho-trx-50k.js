// Insert/Update VIHO TRX 50K at the top with all flavors in stock
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'viho_trx_50k'
  const product = {
    id: productId,
    name: 'VIHO TRX 50K',
    puffs: '50,000',
    price: '$30.00',
    image_name: 'U89.png',
    // Make this the earliest so it appears on top (ascending order)
    created_at: '1990-01-01T00:00:00.000Z'
  }

  const flavors = [
    'Mango Tango',
    'Lemon Refresher',
    'Sour Skittles',
    'Clear',
    'Watermelon Ice',
    'Sour Apple Ice'
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

    console.log('✅ VIHO TRX 50K inserted/updated successfully.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


