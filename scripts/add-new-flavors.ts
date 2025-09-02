import { supabase } from '../lib/supabase'

type ProductFlavorMap = Record<string, string[]>

// Map requested product IDs to new flavors to add (case-insensitive duplicate guard)
const newFlavorsByProduct: ProductFlavorMap = {
  // Adjust by Lost Mary
  adjust: ['Black razz baja'],
  // Lost Mary MO5000 (aka "Lost Mary 5000")
  mo5000: ['Watermelon cherry'],
  // Viho Turbo 10000 (assuming product id used in DB is viho_turbo)
  viho_turbo: ['Dragon fruit watermelon', 'Watermelon berries', 'Grape bubble gum'],
}

async function upsertFlavors(productId: string, flavorNames: string[]): Promise<number> {
  // Ensure product exists
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    console.error(`Product not found: ${productId}`)
    return 0
  }

  // Fetch existing flavors to avoid duplicates
  const { data: existing, error: existingError } = await supabase
    .from('flavors')
    .select('name')
    .eq('product_id', productId)

  if (existingError) {
    console.error(`Failed fetching existing flavors for ${productId}:`, existingError)
    return 0
  }

  const existingNames = new Set((existing || []).map((f) => (f.name || '').toLowerCase().trim()))
  const toInsert = flavorNames
    .map((n) => (n || '').trim())
    .filter((n) => n.length > 0 && !existingNames.has(n.toLowerCase()))
    .map((name) => ({ product_id: productId, name, in_stock: true }))

  if (toInsert.length === 0) {
    console.log(`No new flavors to insert for ${productId}`)
    return 0
  }

  const { error: insertError } = await supabase.from('flavors').insert(toInsert)
  if (insertError) {
    console.error(`Insert error for ${productId}:`, insertError)
    return 0
  }

  console.log(`Inserted ${toInsert.length} flavors for ${productId}`)
  return toInsert.length
}

async function run() {
  try {
    let total = 0
    for (const [productId, flavors] of Object.entries(newFlavorsByProduct)) {
      total += await upsertFlavors(productId, flavors)
    }
    console.log(`Done. Total new flavors inserted: ${total}`)
  } catch (e) {
    console.error('Unexpected error:', e)
    process.exit(1)
  }
}

run()


