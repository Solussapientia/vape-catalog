-- Add description column to flavors table
ALTER TABLE flavors 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create index for faster queries on descriptions
CREATE INDEX IF NOT EXISTS idx_flavors_description ON flavors(description);

-- Update the updated_at timestamp when descriptions are added
-- The trigger already exists from init-database.sql, so this will use it automatically
