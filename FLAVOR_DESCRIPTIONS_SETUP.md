# Flavor Descriptions Feature Setup Guide

## Overview
This guide explains how to set up the new flavor descriptions feature that adds an info icon next to each flavor. When clicked, it displays a unique description for each flavor specific to each brand.

## Setup Steps

### 1. Database Migration
First, you need to add the description column to your Supabase database.

#### Option A: Using Supabase Dashboard SQL Editor
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the following SQL command:

```sql
-- Add description column to flavors table
ALTER TABLE flavors 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create index for faster queries on descriptions
CREATE INDEX IF NOT EXISTS idx_flavors_description ON flavors(description);
```

#### Option B: Using the Migration Script
```bash
# Run the migration script from the project root
npx supabase db push scripts/add-flavor-descriptions.sql
```

### 2. Populate Flavor Descriptions
After adding the column, populate it with the unique flavor descriptions:

```bash
# Install dependencies if needed
npm install

# Run the population script
npx tsx scripts/populate-flavor-descriptions.ts
```

This script will:
- Connect to your Supabase database
- Fetch all products and their flavors
- Update each flavor with its unique description
- Show progress and any errors

### 3. Deploy the Frontend Changes
The frontend changes are already in place and will work automatically once the database is updated.

#### Files Modified:
- `/app/page.tsx` - Added info icons and modal integration
- `/components/FlavorInfoModal.tsx` - New modal component for displaying descriptions
- `/lib/supabase.ts` - Updated Flavor interface to include description field
- `/app/globals.css` - Added styling for info icons and modal animations

### 4. Testing
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your site and verify:
   - Info icons appear next to each flavor
   - Clicking an icon opens a modal with the flavor description
   - Each flavor has a unique description per brand
   - Modal can be closed by clicking X, outside the modal, or pressing Escape

## Features

### Unique Descriptions Per Brand
- Each brand has unique flavor descriptions even for similar flavor names
- For example, "Night Crawler" for Razz has a different description than for other brands
- Descriptions reflect brand-specific formulations and characteristics

### User Experience
- Small info icon (ℹ️) appears next to each flavor name
- Icons have hover effects for better interactivity
- Modal displays flavor name, product name, and detailed description
- Smooth animations for modal open/close
- Keyboard support (Escape key to close)

## Troubleshooting

### If descriptions don't appear:
1. Check that the database migration was successful
2. Verify the populate script ran without errors
3. Check browser console for any JavaScript errors
4. Ensure Supabase connection is working

### If modal doesn't open:
1. Check that FlavorInfoModal component is imported correctly
2. Verify the state management is working in page.tsx
3. Check for any TypeScript errors

## Adding New Products/Flavors

When adding new products or flavors:

1. Update `/scripts/flavor-descriptions.ts` with new descriptions:
```typescript
export const flavorDescriptions = {
  // ... existing products
  new_product_id: {
    'Flavor Name': 'Unique description for this flavor...',
    // ... more flavors
  }
}
```

2. Run the population script again to update the database:
```bash
npx tsx scripts/populate-flavor-descriptions.ts
```

## Notes

- Descriptions are stored in the database, not hardcoded in the frontend
- This allows for easy updates without redeploying the frontend
- The modal component is reusable and can be extended with more features
- All descriptions are brand-specific to reflect unique formulations

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all database migrations were applied
3. Ensure all npm packages are installed correctly
4. Check that environment variables are set properly
