import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thpcdtctcfsaykkgjvaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGNkdGN0Y2ZzYXlra2dqdmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDE4MzgsImV4cCI6MjA2ODI3NzgzOH0.WejcC3W-1jCf1FLkb55JO_GSA_f1KRxW162vnm_J1RE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function addPulseBarPro() {
  try {
    // Note: The notifications table needs to be created manually in Supabase dashboard
    // or via SQL editor with the following structure:
    console.log(`
Note: Please create the notifications table in Supabase dashboard with this SQL:

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_product_id ON notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_notified ON notifications(notified);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read notifications" ON notifications
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to update notifications" ON notifications
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`)

    // Check if Pulse Bar Pro already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('*')
      .eq('id', 'pulse_bar_pro')
      .single()

    if (existingProduct) {
      console.log('Pulse Bar Pro already exists in database')
      return
    }

    // Add Pulse Bar Pro product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        id: 'pulse_bar_pro',
        name: 'PULSE BAR PRO',
        puffs: '45,000',
        price: '$25',
        image_name: '97giuyb.png'
      })
      .select()
      .single()

    if (productError) {
      console.error('Error adding Pulse Bar Pro:', productError)
      return
    }

    console.log('Successfully added Pulse Bar Pro:', product)
    
    // Note: No flavors are added since they're coming soon
    console.log('No flavors added (coming soon)')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
addPulseBarPro()
