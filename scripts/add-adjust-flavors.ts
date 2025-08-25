import { supabase } from '../lib/supabase'

const newFlavors = [
  'Watermelon Ice',
  'Strawberry Banana',
  'Summer Splash',
  'Sour Apple Ice',
  'Blue Razz B Pop',
  'Sour Blue Razz Ice',
  'Sour Peach Raspberry',
  'Sour Grapple',
]

async function addAdjustFlavors() {
  try {
    // Ensure Adjust product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', 'adjust')
      .single()

    if (productError || !product) {
      console.error('Adjust product not found in products table')
      return
    }

    // Fetch existing flavors to avoid duplicates
    const { data: existing, error: existingError } = await supabase
      .from('flavors')
      .select('name')
      .eq('product_id', 'adjust')

    if (existingError) {
      console.error('Failed fetching existing flavors:', existingError)
      return
    }

    const existingNames = new Set((existing || []).map((f) => f.name.toLowerCase()))
    const toInsert = newFlavors
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name) => ({ product_id: 'adjust', name, in_stock: true }))

    if (toInsert.length === 0) {
      console.log('No new flavors to insert for Adjust')
      return
    }

    const { error: insertError } = await supabase
      .from('flavors')
      .insert(toInsert)

    if (insertError) {
      console.error('Insert error:', insertError)
      return
    }

    console.log(`Inserted ${toInsert.length} flavors for Adjust`)
  } catch (e) {
    console.error('Unexpected error:', e)
  }
}

addAdjustFlavors()


