import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function addFlavors() {
  const flavorsByProduct = {
    'fogger_switch_pro_kit': [
      'Strawberry cupcake',
      'Pineapple coconut',
      'Strawberry ice',
      'Omg blowpop',
      'Blueberry watermelon',
      'Sour blue dust'
    ],
    'viho_sp': [  // Viho Supercharge Pro
      'Sour skittles',
      'Lemon drop'
    ],
    'ryl': [  // RYL Classic
      'Blue razz bliss',
      'Wild berry dew',
      'Banana ice',
      'Sour apple ice'
    ],
    'razz_mega': [  // Using razz_mega for the 25000 and 9000 puffs versions
      'New York mint',
      'White grape gush',
      'Polar ice',
      'Vicky'
    ],
    'viho_trx_50k': [
      'Tobacco',
      'Banana taffy ice',
      'Blackberry blizzard',
      'Cool mint',
      'Sour straws',
      'Strawberry banana',
      'Miami mint',
      'Blueberry watermelon',
      'Blue razz ice'
    ],
    'pulse': [  // Geek Bar Pulse
      'Sour apple ice',
      'B burst'
    ],
    'mo5000': [  // Lost Mary MO5000
      'Citrus sunrise',
      'Alphonso mango ice',
      'Ginger beer'
    ],
    'lmmt15000': [  // Lost Mary MT15000
      'Watermelon ice',
      'Raspberry banana',
      'Winter mint',
      'Strawberry banana',
      'Rocket popsicle',
      'Dr. Cherry'
    ],
    'hyde_3300': [
      'Berry ice cream',
      'Really Blueberry',
      'Watermelon ice cream',
      'Pink drink',
      'Energize'
    ]
  }

  let totalAdded = 0
  let totalErrors = 0

  for (const [productId, flavors] of Object.entries(flavorsByProduct)) {
    console.log(`\nAdding flavors for ${productId}:`)
    
    for (const flavorName of flavors) {
      try {
        // Check if flavor already exists
        const { data: existing } = await supabase
          .from('flavors')
          .select('*')
          .eq('product_id', productId)
          .eq('name', flavorName)
          .single()

        if (existing) {
          // Update to in stock if it exists
          const { error: updateError } = await supabase
            .from('flavors')
            .update({ in_stock: true })
            .eq('id', existing.id)

          if (updateError) {
            console.log(`  ❌ Error updating ${flavorName}: ${updateError.message}`)
            totalErrors++
          } else {
            console.log(`  ✅ Updated ${flavorName} to in stock`)
            totalAdded++
          }
        } else {
          // Add new flavor
          const { error: insertError } = await supabase
            .from('flavors')
            .insert({
              product_id: productId,
              name: flavorName,
              in_stock: true
            })

          if (insertError) {
            console.log(`  ❌ Error adding ${flavorName}: ${insertError.message}`)
            totalErrors++
          } else {
            console.log(`  ✅ Added ${flavorName}`)
            totalAdded++
          }
        }
      } catch (error) {
        console.log(`  ❌ Error with ${flavorName}:`, error)
        totalErrors++
      }
    }
  }

  console.log(`\n========================================`)
  console.log(`✅ Total flavors added/updated: ${totalAdded}`)
  if (totalErrors > 0) {
    console.log(`❌ Total errors: ${totalErrors}`)
  }
  console.log(`========================================`)
}

// Run the script
addFlavors()
