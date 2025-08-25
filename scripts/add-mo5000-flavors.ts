import { supabase } from '../lib/supabase'

const newFlavors = ['Berry Cake', 'Watermelon Ice']

async function addMo5000Flavors() {
  try {
    // Ensure mo5000 product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', 'mo5000')
      .single()

    if (productError || !product) {
      console.error('MO5000 product not found in products table')
      return
    }

    // Fetch existing flavors to avoid duplicates
    const { data: existing, error: existingError } = await supabase
      .from('flavors')
      .select('name')
      .eq('product_id', 'mo5000')

    if (existingError) {
      console.error('Failed fetching existing flavors:', existingError)
      return
    }

    const existingNames = new Set((existing || []).map((f) => f.name.toLowerCase()))
    const toInsert = newFlavors
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name) => ({ product_id: 'mo5000', name, in_stock: true }))

    if (toInsert.length === 0) {
      console.log('No new flavors to insert for MO5000')
      return
    }

    const { error: insertError } = await supabase
      .from('flavors')
      .insert(toInsert)

    if (insertError) {
      console.error('Insert error:', insertError)
      return
    }

    console.log(`Inserted ${toInsert.length} flavors for MO5000`)
  } catch (e) {
    console.error('Unexpected error:', e)
  }
}

addMo5000Flavors()
