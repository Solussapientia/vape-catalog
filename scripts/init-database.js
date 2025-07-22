const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function initDatabase() {
  try {
    console.log('Initializing database...')
    
    // Create products table
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          puffs VARCHAR NOT NULL,
          price VARCHAR NOT NULL,
          image_name VARCHAR NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (productsError) {
      console.error('Error creating products table:', productsError)
    } else {
      console.log('✓ Products table created')
    }
    
    // Create flavors table
    const { error: flavorsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS flavors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id VARCHAR REFERENCES products(id) ON DELETE CASCADE,
          name VARCHAR NOT NULL,
          in_stock BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (flavorsError) {
      console.error('Error creating flavors table:', flavorsError)
    } else {
      console.log('✓ Flavors table created')
    }
    
    // Create indexes
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_flavors_product_id ON flavors(product_id);
        CREATE INDEX IF NOT EXISTS idx_flavors_in_stock ON flavors(in_stock);
      `
    })
    
    if (indexError) {
      console.error('Error creating indexes:', indexError)
    } else {
      console.log('✓ Indexes created')
    }
    
    console.log('✅ Database initialization completed!')
    
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

initDatabase() 