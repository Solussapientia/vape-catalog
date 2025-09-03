-- Create notifications table for storing phone numbers for product notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_product_id ON notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_notified ON notifications(notified);

-- Enable Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public insert on notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated users to read notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated users to update notifications" ON notifications;

-- Create policy for public insert access (anyone can sign up for notifications)
CREATE POLICY "Allow public insert on notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create policy for authenticated users to read and update notifications
CREATE POLICY "Allow authenticated users to read notifications" ON notifications
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to update notifications" ON notifications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add unique constraint to prevent duplicate phone numbers for the same product
-- ALTER TABLE notifications ADD CONSTRAINT unique_product_phone UNIQUE (product_id, phone_number);
