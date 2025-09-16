import { createClient } from '@supabase/supabase-js'
import { flavorDescriptions } from './flavor-descriptions'

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function populateFlavorDescriptions() {
  try {
    console.log('Starting flavor description population...')
    
    // Get all products with their flavors
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        flavors (
          id,
          name,
          product_id
        )
      `)
    
    if (productsError) {
      console.error('Error fetching products:', productsError)
      return
    }
    
    if (!products) {
      console.log('No products found')
      return
    }
    
    let totalUpdated = 0
    let totalErrors = 0
    
    // Process each product
    for (const product of products) {
      let productDescriptions = flavorDescriptions[product.id]
      
      // Check for additional flavor descriptions in extra sections
      const extraMappings: Record<string, string> = {
        'razz_mega': 'razz_mega_extra',
        'lmmt15000': 'lmmt15000_extra',
        'viho_sp': 'viho_sp_extra',
        'viho_s': 'viho_s_extra',
        'viho_turbo': 'viho_turbo_extra',
        'hyde_3300': 'hyde_3300_extra',
        'pulse': 'pulse_extra',
        'adjust': 'adjust_extra',
        'mo5000': 'mo5000_extra',
      }
      
      // Merge extra descriptions if they exist
      if (extraMappings[product.id] && flavorDescriptions[extraMappings[product.id]]) {
        productDescriptions = {
          ...productDescriptions,
          ...flavorDescriptions[extraMappings[product.id] as keyof typeof flavorDescriptions]
        }
      }
      
      if (!productDescriptions || Object.keys(productDescriptions).length === 0) {
        console.log(`⚠️  No descriptions found for product: ${product.name} (${product.id})`)
        continue
      }
      
      console.log(`\n📦 Processing ${product.name}...`)
      
      // Process each flavor for this product
      for (const flavor of product.flavors) {
        const description = productDescriptions[flavor.name]
        
        if (!description) {
          console.log(`  ⚠️  No description for flavor: ${flavor.name}`)
          continue
        }
        
        // Update the flavor with its description
        const { error: updateError } = await supabase
          .from('flavors')
          .update({ description })
          .eq('id', flavor.id)
        
        if (updateError) {
          console.error(`  ❌ Error updating ${flavor.name}:`, updateError)
          totalErrors++
        } else {
          console.log(`  ✅ Updated: ${flavor.name}`)
          totalUpdated++
        }
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ Flavor description population completed!')
    console.log(`📊 Total flavors updated: ${totalUpdated}`)
    console.log(`❌ Total errors: ${totalErrors}`)
    
  } catch (error) {
    console.error('Error in population script:', error)
  }
}

// Run the script
populateFlavorDescriptions()
