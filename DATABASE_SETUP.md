# Database Setup Instructions

## 1. Create Supabase Database Tables

Go to your Supabase dashboard at https://thpcdtctcfsaykkgjvaa.supabase.co and run the SQL from `scripts/init-database.sql` in the SQL Editor.

## 2. Populate Database with Current Products

Run the population script to add all your current vape products and flavors:

```bash
npm install
npx tsx scripts/populate-database.ts
```

## 3. Database Schema

### Products Table
- `id` (TEXT, PRIMARY KEY) - Unique product identifier
- `name` (TEXT) - Product name
- `puffs` (TEXT) - Puff count description
- `price` (TEXT) - Price information
- `image_name` (TEXT) - Image filename
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Flavors Table
- `id` (UUID, PRIMARY KEY) - Unique flavor identifier
- `product_id` (TEXT, FOREIGN KEY) - References products.id
- `name` (TEXT) - Flavor name
- `in_stock` (BOOLEAN) - Stock status
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## 4. Android App Integration

Your Android app can now:

1. **Fetch all flavors:**
```sql
SELECT f.*, p.name as product_name 
FROM flavors f 
JOIN products p ON f.product_id = p.id
ORDER BY p.name, f.name;
```

2. **Update stock status:**
```sql
UPDATE flavors 
SET in_stock = [true/false], updated_at = NOW() 
WHERE id = '[flavor_id]';
```

3. **Get products with flavor counts:**
```sql
SELECT p.*, 
       COUNT(f.id) as total_flavors,
       COUNT(CASE WHEN f.in_stock = true THEN 1 END) as in_stock_count
FROM products p
LEFT JOIN flavors f ON p.id = f.product_id
GROUP BY p.id
ORDER BY p.created_at;
```

## 5. API Endpoints for Android App

The website automatically updates when you change stock status in the database. Your Android app can use the Supabase REST API:

- **Base URL:** https://thpcdtctcfsaykkgjvaa.supabase.co/rest/v1/
- **API Key:** Your anon key from the environment variables
- **Headers:** 
  - `apikey: [your_anon_key]`
  - `Authorization: Bearer [your_anon_key]`
  - `Content-Type: application/json`

### Example API Calls:

**Get all flavors:**
```
GET /flavors?select=*,products(name)
```

**Update flavor stock:**
```
PATCH /flavors?id=eq.[flavor_id]
Body: {"in_stock": true}
```

## 6. Real-time Updates

The database supports real-time subscriptions. Your Android app can listen for changes:

```javascript
supabase
  .channel('flavors')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'flavors' }, 
    (payload) => {
      // Handle stock status change
    })
  .subscribe()
```

## 7. Security

- Public read access is enabled for products and flavors
- Update permissions require authentication
- Row Level Security (RLS) is enabled
- Use service role key for admin operations in your Android app

## 8. Current Data

The database contains:
- 15 vape products
- 300+ flavors with current stock status
- All images properly mapped
- Proper relationships between products and flavors 