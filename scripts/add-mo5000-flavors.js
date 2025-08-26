// Adds 'Black Mint' and 'Blue Razz Ice' to Lost Mary MO5000 as in stock
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'mo5000'
  const newFlavors = ['Black Mint', 'Blue Razz Ice']

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      console.error('MO5000 product not found in products table')
      process.exit(1)
    }

    const { data: existing, error: existingError } = await supabase
      .from('flavors')
      .select('name')
      .eq('product_id', productId)

    if (existingError) {
      console.error('Failed fetching existing flavors:', existingError)
      process.exit(1)
    }

    const existingNames = new Set((existing || []).map((f) => (f.name || '').toLowerCase()))
    const toInsert = newFlavors
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name) => ({ product_id: productId, name, in_stock: true }))

    if (toInsert.length === 0) {
      console.log('No new flavors to insert for MO5000')
      return
    }

    const { error: insertError } = await supabase
      .from('flavors')
      .insert(toInsert)

    if (insertError) {
      console.error('Insert error:', insertError)
      process.exit(1)
    }

    console.log(`Inserted ${toInsert.length} flavors for MO5000`)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


