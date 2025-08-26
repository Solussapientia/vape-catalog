// Checks and fixes image_name for Tyson Heavyweight
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  const id = 'tyson_heavyweight'
  const expected = '4tfr.webp'
  const { data, error } = await supabase.from('products').select('id,name,image_name').eq('id', id).maybeSingle()
  if (error) {
    console.error('Fetch error:', error)
    process.exit(1)
  }
  if (!data) {
    console.error('Product not found')
    process.exit(1)
  }
  const current = (data.image_name || '')
  console.log('Current image_name:', JSON.stringify(current))
  const trimmed = current.trim()
  if (trimmed !== expected) {
    console.log(`Updating image_name to ${expected}...`)
    const { error: updErr } = await supabase.from('products').update({ image_name: expected }).eq('id', id)
    if (updErr) {
      console.error('Update error:', updErr)
      process.exit(1)
    }
    console.log('✅ Updated image_name.')
  } else {
    console.log('✅ image_name already correct.')
  }
}

run()


