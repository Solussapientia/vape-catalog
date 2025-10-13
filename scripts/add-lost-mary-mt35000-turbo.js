// Inserts/updates Lost Mary MT35000 Turbo device; positions directly under Geek Bar Pulse
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const productId = 'lost_mary_mt35000_turbo'

  // Place directly after Geek Bar Pulse in created order if possible
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
    name: 'Lost Mary MT35000 Turbo',
    puffs: '35,000',
    price: '$25.00',
    image_name: '92eu.jpg', // provided screenshot filename
    created_at: createdAt,
  }

  try {
    console.log('Upserting product:', product.name)
    const { error: upsertProductError } = await supabase
      .from('products')
      .upsert(product)

    if (upsertProductError) {
      console.error('Product upsert failed:', upsertProductError)
      process.exit(1)
    }

    console.log('✅ Lost Mary MT35000 Turbo inserted/updated successfully.')
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


