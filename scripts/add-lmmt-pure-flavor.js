// Adds 'Pure' flavor (in stock) to Lost Mary MT15000 Turbo (product id: lmmt15000)
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'lmmt15000'
  const flavorName = 'Pure'

  try {
    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError) {
      console.error('Product lookup failed:', productError)
      process.exit(1)
    }

    // Upsert flavor: delete any existing duplicates for idempotency then insert
    await supabase.from('flavors').delete().eq('product_id', productId).eq('name', flavorName)

    const { error: insertError } = await supabase
      .from('flavors')
      .insert({ product_id: productId, name: flavorName, in_stock: true })

    if (insertError) {
      console.error('Insert flavor failed:', insertError)
      process.exit(1)
    }

    console.log('✅ Added Pure flavor (in stock) to Lost Mary MT15000 Turbo')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


