// Inserts/updates UT 50K with provided image and flavors; sorts to end by created_at
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'ut_50k'

  // Aim to position UT directly below Fogger by setting created_at
  let createdAt = new Date().toISOString()
  try {
    const { data: fogger } = await supabase
      .from('products')
      .select('*')
      .eq('id', 'fogger_switch_pro_kit')
      .maybeSingle()
    if (fogger && fogger.created_at) {
      const plusOneMs = new Date(new Date(fogger.created_at).getTime() + 1)
      createdAt = plusOneMs.toISOString()
    }
  } catch (_) {}

  const product = {
    id: productId,
    name: 'UT',
    puffs: '50,000',
    price: '$30 or 2 for $50',
    image_name: 'iug.png',
    // Set just after Fogger so it sorts directly below
    created_at: createdAt
  }

  const flavors = [
    'Cool mint & Icy mint',
    'White peach & Raspberry',
    'Passionfruit & Mango',
    'Mango & Strawberry',
    'Clear & Clear',
    'Sour fab & Citrus ice',
    'Banana smoothie & Strawberry',
    'Watermelon & B-pop',
    'Miami mint & Mint slushy',
    'Blue razz & Lemonade',
    'Green apple & Fuji apple',
    'Bluerazz ice & Triple berry',
    'Tobacco & Gold tobacco',
    'Naked & Spring water'
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

    console.log('✅ UT 50K inserted/updated successfully.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


