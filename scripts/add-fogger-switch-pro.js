// Upserts Fogger Switch Pro kit and pod with flavors
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function upsertProduct(product, flavors) {
  const { error: upsertErr } = await supabase.from('products').upsert(product)
  if (upsertErr) throw upsertErr
  await supabase.from('flavors').delete().eq('product_id', product.id)
  const rows = flavors.map((name) => ({ product_id: product.id, name, in_stock: true }))
  const { error: insertErr } = await supabase.from('flavors').insert(rows)
  if (insertErr) throw insertErr
}

async function run() {
  try {
    const kit = {
      id: 'fogger_switch_pro_kit',
      name: 'Fogger switch pro kit',
      puffs: '30,000',
      price: '$25.00',
      image_name: 'ref.jpg',
      // Make kit the earliest so Fogger card renders first
      created_at: '1989-01-01T00:00:00.000Z',
    }
    const kitFlavors = [
      'grape slush',
      'gummy bear',
      'frozen lemon',
      'frozen blueberry',
      'strawberry watermelon',
      'kiwi dragon berry',
      'strawberry kiwi',
      'watermelon ice',
      'blue razz ice',
      'frozen watermelon',
      'strawberry banana',
      'orange slush',
      'cola slush',
      'juicy peach ice',
      'sour apple ice',
      'frozen banana',
    ]

    const pod = {
      id: 'fogger_switch_pod',
      name: 'Fogger switch pod',
      puffs: '30,000',
      price: '$15.00',
      image_name: 'ref.jpg',
      created_at: '1989-01-01T00:00:00.000Z',
    }
    const podFlavors = [
      'blue razz ice',
      'strawberry watermelon',
      'cool mint',
      'sour gush',
      'gummy bear',
      'blueberry watermelon',
      'watermelon ice',
      'juicy peach ice',
      'miami mint',
      'sour apple ice',
      'pineapple coconut',
      'watermelon bubble gum',
      'strawberry kiwi',
    ]

    console.log('Upserting Fogger Switch Pro kit...')
    await upsertProduct(kit, kitFlavors)
    console.log('Upserting Fogger Switch pod...')
    await upsertProduct(pod, podFlavors)
    console.log('✅ Fogger Switch Pro kit and pod inserted/updated successfully.')
  } catch (e) {
    console.error('Error:', e)
    process.exit(1)
  }
}

run()


