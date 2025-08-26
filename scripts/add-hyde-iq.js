// Inserts/updates Hyde IQ with flavors at the bottom (latest created_at)
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'hyde_iq'
  const product = {
    id: productId,
    name: 'Hyde IQ',
    puffs: '5,000',
    price: '$2.50',
    image_name: '240.webp',
    created_at: new Date().toISOString()
  }

  const flavors = [
    'Jungle juice',
    'watermelon chew',
    'lemon drop',
    'strawberry limeaid ice',
    'kiwi apple pomberry ice',
    'killa confetti',
    'apple peach watermelon',
    'blue drink',
    'peach blueberry',
    'mystery mix',
    'watermelon fix',
    'pink burst',
    'dragonberry cotton clouds',
    'dew',
    'cranberry lime fix',
    'pink drink',
    'blue raz peach bears ice',
    'jolly sour apple ice'
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

    console.log('✅ Hyde IQ inserted/updated successfully.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


