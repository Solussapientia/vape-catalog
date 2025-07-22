import { supabase } from '../lib/supabase'

async function checkDatabase() {
  try {
    console.log('Checking database connection...')
    
    // Try to query products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('Products table error:', productsError)
      console.log('This likely means the tables need to be created in Supabase dashboard')
    } else {
      console.log('✓ Products table exists')
      console.log('Products count:', products?.length || 0)
    }
    
    // Try to query flavors table
    const { data: flavors, error: flavorsError } = await supabase
      .from('flavors')
      .select('*')
      .limit(1)
    
    if (flavorsError) {
      console.error('Flavors table error:', flavorsError)
    } else {
      console.log('✓ Flavors table exists')
      console.log('Flavors count:', flavors?.length || 0)
    }
    
    // Test connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)
    
    if (connectionError) {
      console.error('Connection error:', connectionError)
    } else {
      console.log('✓ Database connection successful')
    }
    
  } catch (error) {
    console.error('Error checking database:', error)
  }
}

checkDatabase() 