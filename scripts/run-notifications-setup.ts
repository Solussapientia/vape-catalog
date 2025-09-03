import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupNotificationsTable() {
  console.log('Setting up notifications table...')
  
  // Since we can't run raw SQL via the anon key, let's just test if the table exists
  // and provide instructions if it doesn't
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .limit(1)
  
  if (error && error.message.includes('relation "public.notifications" does not exist')) {
    console.log('\n❌ The notifications table does not exist yet.')
    console.log('\n📋 Please run this SQL in your Supabase dashboard:\n')
    console.log('1. Go to https://supabase.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Go to SQL Editor (on the left sidebar)')
    console.log('4. Click "New query"')
    console.log('5. Copy and paste the SQL from scripts/create-notifications-table.sql')
    console.log('6. Click "Run"\n')
    
    console.log('Or copy this simplified version:\n')
    console.log(`-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (sign up for notifications)
CREATE POLICY "Allow public insert on notifications" ON notifications
  FOR INSERT WITH CHECK (true);`)
    
  } else if (error) {
    console.log('Error checking table:', error)
  } else {
    console.log('✅ Notifications table already exists!')
    
    // Test inserting a record
    const testPhone = 'test-' + Date.now()
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        product_id: 'pulse_bar_pro',
        phone_number: testPhone
      })
    
    if (insertError) {
      console.log('⚠️  Table exists but insert failed:', insertError.message)
      console.log('You may need to check the RLS policies.')
    } else {
      console.log('✅ Successfully tested inserting a notification!')
      
      // Clean up test record
      await supabase
        .from('notifications')
        .delete()
        .eq('phone_number', testPhone)
    }
  }
}

setupNotificationsTable()
