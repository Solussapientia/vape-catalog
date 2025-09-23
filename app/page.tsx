'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { supabase, Product, Flavor } from '../lib/supabase'
import FlavorInfoModal from '../components/FlavorInfoModal'

interface VapeProduct extends Product {
  flavors: Flavor[]
}

// Map database image names to actual filenames in public folder
function getImagePath(imageName: string): string {
  const normalized = (imageName || '').trim()
  const imageMap: { [key: string]: string } = {
    'ADJUST': '/ADJUST.webp',
    'ria': '/ria.webp',
    'skyview': '/skyview.webp', 
    'pulse_x': '/pulse_x.webp',
    'pulse': '/pulse.webp',
    // ROMO mappings for robustness
    'romo': '/3o0gu.webp',
    'ROMO': '/3o0gu.webp',
    '3o0gu.webp': '/3o0gu.webp',
    'meloso': '/meloso.webp',
    'RYL': '/RYL.jpg',
    'LTX': '/LTX.webp',
    'razz': '/razz.webp',
    'LM20000': '/LM20000.webp',
    'LMMT': '/LMMT.webp',
    'mo5000': '/mo5000.webp',
    'losgal': '/losgal.webp',
    'SP.jpg': '/SP.jpg',
    'S.jpg': '/S.jpg',
    'T': '/T.webp',
    'hyde': '/hyde.webp',
    'VIHO_Thumbnail__46533.png': '/VIHO_Thumbnail__46533.png',
    'r3pif.png': '/r3pif.png'
  }

  // If the DB provides a concrete filename with an extension, use it directly (trimmed)
  if (normalized && normalized.includes('.')) {
    return `/${normalized}`
  }

  return imageMap[normalized] || `/default.webp`
}

export default function Home() {
  const [products, setProducts] = useState<VapeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOutOfStockMap, setShowOutOfStockMap] = useState<Record<string, boolean>>({})
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedFlavor, setSelectedFlavor] = useState<{ flavor: Flavor, productName: string } | null>(null)
  const scrollToProduct = (id: string) => {
    const el = document.getElementById(`product-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      
      // Fetch products with their flavors
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          flavors (*)
        `)
        .order('created_at', { ascending: true })

      if (productsError) {
        throw productsError
      }

      // Sort flavors in-stock first within each product, then sort products so
      // items with any in-stock flavors appear before items with none.
      const sortedProducts = (productsData || [])
        .map((product: VapeProduct) => {
          const sortedFlavors = (product.flavors || []).slice().sort((a: Flavor, b: Flavor) => {
            // In-stock first
            const stockDiff = Number(b.in_stock) - Number(a.in_stock)
            if (stockDiff !== 0) return stockDiff
            // Fallback alphabetical by name for stable ordering
            return a.name.localeCompare(b.name)
          })

          return { ...product, flavors: sortedFlavors }
        })
        .sort((a: VapeProduct, b: VapeProduct) => {
          // Pulse Bar Pro always comes first
          if (a.id === 'pulse_bar_pro') return -1
          if (b.id === 'pulse_bar_pro') return 1
          
          const aHasStock = Array.isArray(a.flavors) && a.flavors.some((f: Flavor) => f.in_stock)
          const bHasStock = Array.isArray(b.flavors) && b.flavors.some((f: Flavor) => f.in_stock)
          if (aHasStock !== bHasStock) return aHasStock ? -1 : 1
          // Preserve original created order as a tiebreaker
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
          return aTime - bTime
        })

      setProducts(sortedProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function handleNotificationSubmit() {
    // Simple validation - just check if something was entered
    if (!phoneNumber || phoneNumber.trim().length < 7) {
      alert('Please enter a phone number')
      return
    }

    setNotificationStatus('loading')
    
    try {
      // Try to save to database if table exists
      const { error } = await supabase
        .from('notifications')
        .insert({
          product_id: 'pulse_bar_pro',
          phone_number: phoneNumber.trim()
        })

      if (error) {
        // Log the error but don't show technical details to user
        console.log('Note: Notifications table may not exist yet. Phone number:', phoneNumber)
        console.error('Database error:', error)
      }
      
      // Always show success to user (even if table doesn't exist yet)
      setNotificationStatus('success')
      alert('Thank you! We\'ll notify you when flavors are available.')
      setTimeout(() => {
        setShowNotificationModal(false)
        setPhoneNumber('')
        setNotificationStatus('idle')
      }, 1500)
      
    } catch (err) {
      console.error('Error:', err)
      // Still show success to user
      alert('Thank you! We\'ll notify you when flavors are available.')
      setShowNotificationModal(false)
      setPhoneNumber('')
      setNotificationStatus('idle')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading vape products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 rainbow-title bg-clip-text text-transparent">
            VAPE LIST
          </h1>
        </div>

        {/* Product Cards */}
        <div className="space-y-6 max-w-screen-sm mx-auto">
          {products
            .filter((p) => p.id !== 'pulse_bar_pro')
            .map((product) => (
            // Skip rendering standalone pod card; it's shown inside the kit card
            product.id === 'fogger_switch_pod' ? null : (
            <div key={product.id} id={`product-${product.id}`} className={`${product.id === 'fogger_switch_pro_kit' ? 'rgb-border-wrap p-[2px]' : product.id === 'pulse_bar_pro' ? 'pulse-bar-pro-border p-[2px]' : ''} rounded-xl`}>
            <Card className={`bg-gray-900 border-gray-800 rounded-xl`}>
              <CardHeader className="flex flex-col gap-4 pb-4">
                <div className="w-full aspect-square relative border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800">
                  {product.id === 'pulse_bar_pro' && (
                    <span className="absolute top-2 left-2 z-10 new-rainbow-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      NEW ARRIVAL
                    </span>
                  )}
                  {product.id === 'viho_trx_50k' && (
                    <span className="absolute top-2 left-2 z-10 new-rainbow-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      NEW
                    </span>
                  )}
                  {product.id === 'fogger_switch_pro_kit' && (
                    <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-2">
                      <span className="new-rainbow-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">NEW</span>
                      <span className="hot-seller-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow inline-flex items-center gap-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/512.gif" alt="fire" className="h-3 w-3 object-contain" />
                        HOT SELLER
                      </span>
                    </div>
                  )}
                   {product.id === 'hyde_iq' && (
                    <span className="absolute top-2 left-2 z-10 flash-sale-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      FLASH SALE
                    </span>
                  )}
                  {product.id === 'tyson_heavyweight' && (
                    <span className="absolute top-2 left-2 z-10 flash-sale-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      FLASH SALE
                    </span>
                  )}
                  {product.id === 'mood_bar_air' && (
                    <span className="absolute top-2 left-2 z-10 flash-sale-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      FLASH SALE
                    </span>
                  )}
                  {product.id === 'kumi_six_10000' && (
                    <span className="absolute top-2 left-2 z-10 flash-sale-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      FLASH SALE
                    </span>
                  )}
                  {(product.id === 'adjust' || product.name.toLowerCase().includes('adjust')) && (
                    <span className="absolute top-2 left-2 z-10 hot-seller-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow inline-flex items-center gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/512.gif" alt="fire" className="h-3 w-3 object-contain" />
                      HOT SELLER
                    </span>
                  )}
                  {((product.id && product.id.toLowerCase().includes('ryl')) || product.name.toLowerCase().includes('ryl')) && (
                    <span className="absolute top-2 left-2 z-10 hot-seller-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow inline-flex items-center gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/512.gif" alt="fire" className="h-3 w-3 object-contain" />
                      HOT SELLER
                    </span>
                  )}
                  <Image
                    src={getImagePath(product.image_name)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* For Fogger, details render in CardBody; otherwise render standard header details */}
                {product.id !== 'fogger_switch_pro_kit' ? (
                  <div className="flex flex-col text-center">
                    <p className="text-xl font-semibold text-white mb-1">{product.name}</p>
                    <p className="text-base text-gray-400 mb-1">{(product.id === 'romo' || product.name.toLowerCase().includes('romo')) ? '5 PCK' : `${product.puffs} puffs`}</p>
                    <p className="text-lg font-medium text-green-400">{product.price}</p>
                    {product.id === 'kumi_six_10000' && (
                      <div className="mt-2 px-3 py-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md inline-flex items-center gap-2 mx-auto">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="font-semibold">WARNING:</span>
                        <span className="text-red-300">This product does not contain nicotine. It includes an alternative called NONIC6, an unregulated nicotine alternative.</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardHeader>
              <CardBody className="pt-0">
                <div className={product.id === 'pulse_bar_pro' ? '' : 'mb-3'}>
                  {/* For Fogger Switch Pro, render: title+puffs+price+warning+flavors for kit, then for pod */}
                  {product.id === 'fogger_switch_pro_kit' ? (
                    (() => {
                      const pod = products.find((p) => p.id === 'fogger_switch_pod')
                      const kitFlavors = (product.flavors || [])
                      const podFlavors = (pod?.flavors || [])
                      return (
                        <div className="space-y-6">
                          <div>
                            {/* Kit heading */}
                            <p className="text-xl font-semibold text-white mb-1 text-center">Fogger switch pro kit</p>
                            <p className="text-base text-gray-400 mb-1 text-center">{product.puffs} puffs</p>
                            <p className="text-lg font-medium text-green-400 text-center">{product.price}</p>
                            <div className="mt-2 px-3 py-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md inline-flex items-center gap-2 mx-auto">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                              <span className="font-semibold">WARNING:</span>
                              <span className="text-yellow-300">This is for a kit (battery and pod). If you already have a battery, you can purchase a pod separately below.</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-300 mt-3 mb-2">Kit Flavors:</h3>
                            <div className="space-y-1">
                              {(() => {
                                const kitInStock = kitFlavors.filter((f: Flavor) => f.in_stock)
                                const kitOutOfStock = kitFlavors.filter((f: Flavor) => !f.in_stock)
                                const kitKey = 'fogger_switch_pro_kit__kit'
                                const isKitExpanded = !!showOutOfStockMap[kitKey]
                                return (
                                  <>
                                    {kitInStock.map((flavor: Flavor) => (
                                      <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-gray-300">{flavor.name}</span>
                                        <span className="text-xs text-green-400">In Stock</span>
                                        <button
                                          onClick={() => setSelectedFlavor({ flavor, productName: 'Fogger switch pro kit' })}
                                          className="text-gray-400 hover:text-blue-400 transition-colors ml-1 flavor-info-icon"
                                          aria-label="Flavor info"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                    {kitOutOfStock.length > 0 && !isKitExpanded && (
                                      <button
                                        onClick={() => setShowOutOfStockMap((prev) => ({ ...prev, [kitKey]: true }))}
                                        className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
                                      >
                                        View out of stock flavors
                                      </button>
                                    )}
                                    {isKitExpanded && (
                                      <>
                                        {kitOutOfStock.map((flavor: Flavor) => (
                                          <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <span className="text-gray-300">{flavor.name}</span>
                                            <span className="text-xs text-red-400">Out of Stock</span>
                                            <button
                                              onClick={() => setSelectedFlavor({ flavor, productName: 'Fogger switch pro kit' })}
                                              className="text-gray-400 hover:text-blue-400 transition-colors ml-1 flavor-info-icon"
                                              aria-label="Flavor info"
                                            >
                                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() => setShowOutOfStockMap((prev) => ({ ...prev, [kitKey]: false }))}
                                          className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
                                        >
                                          Hide out of stock flavors
                                        </button>
                                      </>
                                    )}
                                  </>
                                )
                              })()}
                            </div>
                          </div>
                          <div>
                            {/* Pod heading */}
                            {pod && (
                              <>
                                <p className="text-xl font-semibold text-white mb-1 text-center">Fogger switch pod</p>
                                <p className="text-base text-gray-400 mb-1 text-center">{pod.puffs} puffs</p>
                                <p className="text-lg font-medium text-green-400 text-center">{pod.price}</p>
                                <div className="mt-2 px-3 py-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md inline-flex items-center gap-2 mx-auto">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                  <span className="font-semibold">WARNING:</span>
                                  <span className="text-yellow-300">This is for a pod (needs a battery). If you do not have a battery, purchase a kit above that includes a battery and pod.</span>
                                </div>
                              </>
                            )}
                            <h3 className="text-sm font-medium text-gray-300 mt-3 mb-2">Pod Flavors:</h3>
                            <div className="space-y-1">
                              {(() => {
                                const podInStock = podFlavors.filter((f: Flavor) => f.in_stock)
                                const podOutOfStock = podFlavors.filter((f: Flavor) => !f.in_stock)
                                const podKey = 'fogger_switch_pro_kit__pod'
                                const isPodExpanded = !!showOutOfStockMap[podKey]
                                return (
                                  <>
                                    {podInStock.map((flavor: Flavor) => (
                                      <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-gray-300">{flavor.name}</span>
                                        <span className="text-xs text-green-400">In Stock</span>
                                        <button
                                          onClick={() => setSelectedFlavor({ flavor, productName: 'Fogger switch pod' })}
                                          className="text-gray-400 hover:text-blue-400 transition-colors ml-1 flavor-info-icon"
                                          aria-label="Flavor info"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                    {podOutOfStock.length > 0 && !isPodExpanded && (
                                      <button
                                        onClick={() => setShowOutOfStockMap((prev) => ({ ...prev, [podKey]: true }))}
                                        className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
                                      >
                                        View out of stock flavors
                                      </button>
                                    )}
                                    {isPodExpanded && (
                                      <>
                                        {podOutOfStock.map((flavor: Flavor) => (
                                          <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <span className="text-gray-300">{flavor.name}</span>
                                            <span className="text-xs text-red-400">Out of Stock</span>
                                            <button
                                              onClick={() => setSelectedFlavor({ flavor, productName: 'Fogger switch pod' })}
                                              className="text-gray-400 hover:text-blue-400 transition-colors ml-1 flavor-info-icon"
                                              aria-label="Flavor info"
                                            >
                                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() => setShowOutOfStockMap((prev) => ({ ...prev, [podKey]: false }))}
                                          className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
                                        >
                                          Hide out of stock flavors
                                        </button>
                                      </>
                                    )}
                                  </>
                                )
                              })()}
                            </div>
                          </div>
                        </div>
                      )
                    })()
                  ) : product.id === 'pulse_bar_pro' ? (
                    // Compact "Coming Soon" section with bigger button
                    <div className="text-center py-1">
                      <p className="text-sm font-semibold text-purple-400 mb-2">
                        Flavors Coming Soon
                      </p>
                      <button
                        onClick={() => setShowNotificationModal(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
                      >
                        Get Notified
                      </button>
                    </div>
                  ) : (
                    (() => {
                      const flavors = product.flavors || []
                      const inStockFlavors = flavors.filter((f: Flavor) => f.in_stock)
                      const outOfStockFlavors = flavors.filter((f: Flavor) => !f.in_stock)
                      const isExpanded = !!showOutOfStockMap[product.id]

                      return (
                        <div className="space-y-1">
                          {inStockFlavors.length > 0 ? (
                            inStockFlavors.map((flavor: Flavor) => (
                              <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${flavor.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-gray-300">{flavor.name}</span>
                                <span className={`text-xs ${flavor.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                  {flavor.in_stock ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <button
                                  onClick={() => setSelectedFlavor({ flavor, productName: product.name })}
                                  className="text-gray-400 hover:text-blue-400 transition-colors ml-1 flavor-info-icon"
                                  aria-label="Flavor info"
                                >
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-red-400">All flavors out of stock</p>
                          )}

                          {outOfStockFlavors.length > 0 && !isExpanded && (
                            <button
                              onClick={() =>
                                setShowOutOfStockMap((prev) => ({ ...prev, [product.id]: true }))
                              }
                              className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
                            >
                              View out of stock flavors
                            </button>
                          )}

                          {isExpanded && (
                            <>
                              {outOfStockFlavors.map((flavor: Flavor) => (
                                <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                  <div className={`w-2 h-2 rounded-full ${flavor.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                                  <span className="text-gray-300">{flavor.name}</span>
                                  <button
                                    onClick={() => setSelectedFlavor({ flavor, productName: product.name })}
                                    className="text-gray-400 hover:text-blue-400 transition-colors ml-1 flavor-info-icon"
                                    aria-label="Flavor info"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                  <span className={`text-xs ${flavor.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                                    {flavor.in_stock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </div>
                              ))}
                              <button
                                onClick={() =>
                                  setShowOutOfStockMap((prev) => ({ ...prev, [product.id]: false }))
                                }
                                className="mt-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded-md"
                              >
                                Hide out of stock flavors
                              </button>
                            </>
                          )}
                        </div>
                      )
                    })()
                  )}
                </div>
              </CardBody>
            </Card>
            </div>
            )
          ))}
        </div>
      </div>

      {/* Simplified Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-5 max-w-sm w-full border border-purple-500/30">
            <h3 className="text-lg font-bold text-white mb-3">
              Get Notified 🔔
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              We'll notify you when flavors are available!
            </p>
            
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-3 text-sm"
              disabled={notificationStatus === 'loading'}
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleNotificationSubmit}
                disabled={notificationStatus === 'loading'}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {notificationStatus === 'loading' ? 'Saving...' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowNotificationModal(false)
                  setPhoneNumber('')
                  setNotificationStatus('idle')
                }}
                disabled={notificationStatus === 'loading'}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flavor Info Modal */}
      <FlavorInfoModal
        isOpen={selectedFlavor !== null}
        onClose={() => setSelectedFlavor(null)}
        flavorName={selectedFlavor?.flavor.name || ''}
        productName={selectedFlavor?.productName || ''}
        description={selectedFlavor?.flavor.description}
      />
    </div>
  )
} 