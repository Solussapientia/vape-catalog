# VAPE LIST - Mobile-First Vape Store

A modern, mobile-friendly vape store catalog built with Next.js and HeroUI.

## Features

- 📱 Mobile-first responsive design
- 🎨 Modern UI with HeroUI components
- 🌟 Product cards with images, pricing, and puff counts
- 🔴🟢 Real-time flavor stock indicators
- ⚡ Fast loading and optimized for mobile

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Railway

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Next.js project
3. The `railway.json` file configures the deployment settings
4. Your site will be live at your Railway-provided URL

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with TailwindCSS
│   ├── layout.tsx           # Root layout with HeroUI provider
│   ├── page.tsx             # Main page with vape products
│   └── providers.tsx        # HeroUI provider configuration
├── public/                  # Static assets (vape images)
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # TailwindCSS configuration
└── railway.json             # Railway deployment config
```

## Adding New Products

Edit the `vapeProducts` array in `app/page.tsx` to add new products with:
- Product name, puffs, price
- Image filename (place in `/public/` folder)
- Flavor list with stock status

## Tech Stack

- **Next.js 14** - React framework
- **HeroUI** - Modern React component library
- **TailwindCSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Railway** - Deployment platform 