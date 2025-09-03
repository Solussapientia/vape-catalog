const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(
  'https://thpcdtctcfsaykkgjvaa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'
)

async function run() {
  const ids = ['fogger_switch_pro_kit', 'fogger_switch_pod']
  for (const id of ids) {
    const { data, error } = await supabase.from('products').select('id,name,image_name,updated_at').eq('id', id).maybeSingle()
    if (error) {
      console.error('Error fetching', id, error)
    } else {
      console.log(id, '->', data)
    }
  }
}

run()


