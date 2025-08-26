'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { supabase, Product, Flavor } from '../lib/supabase'

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
    'VIHO_Thumbnail__46533.png': '/VIHO_Thumbnail__46533.png'
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
          <div className="w-full flex justify-center mb-2">
            {/* decorative looping gif */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/24r.gif" alt="shh" className="h-20 w-auto object-contain" />
          </div>
          <p className="text-gray-300 text-lg md:text-xl font-semibold tracking-wide uppercase">your secret go to vape list</p>
        </div>

        {/* Product Cards */}
        <div className="space-y-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-col gap-4 pb-4">
                <div className="w-full aspect-square relative border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800">
                  {product.id === 'viho_trx_50k' && (
                    <span className="absolute top-2 left-2 z-10 new-rainbow-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                      NEW
                    </span>
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
                {/* Header pricing area: special combined render for Fogger Switch Pro */}
                {product.id === 'fogger_switch_pro_kit' ? (
                  (() => {
                    const pod = products.find((p) => p.id === 'fogger_switch_pod')
                    return (
                      <div className="flex flex-col text-center">
                        <p className="text-xl font-semibold text-white mb-1">Fogger Switch Pro</p>
                        {/* NEW badge */}
                        <span className="mx-auto mb-2 new-rainbow-badge text-white text-[10px] font-bold px-2 py-1 rounded-md shadow w-max">NEW</span>

                        {/* Kit section */}
                        <div className="mt-2">
                          <p className="text-sm text-gray-300 font-medium">Fogger switch pro kit</p>
                          <p className="text-base text-gray-400">{product.puffs} puffs</p>
                          <p className="text-lg font-medium text-green-400">{product.price}</p>
                          <div className="mt-2 px-3 py-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md inline-flex items-center gap-2 mx-auto">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                            <span className="font-semibold">WARNING:</span>
                            <span className="text-yellow-300">This is for a kit (battery and pod). If you already have a battery, you can purchase a pod separately below.</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="my-3 border-t border-gray-700" />

                        {/* Pod section */}
                        {pod && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-300 font-medium">Fogger switch pod</p>
                            <p className="text-base text-gray-400">{pod.puffs} puffs</p>
                            <p className="text-lg font-medium text-green-400">{pod.price}</p>
                            <div className="mt-2 px-3 py-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md inline-flex items-center gap-2 mx-auto">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                              <span className="font-semibold">WARNING:</span>
                              <span className="text-yellow-300">This is for a pod (needs a battery). If you do not have a battery, purchase a kit above that includes a battery and pod.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()
                ) : (
                  <div className="flex flex-col text-center">
                    <p className="text-xl font-semibold text-white mb-1">{product.name}</p>
                    <p className="text-base text-gray-400 mb-1">{product.puffs} puffs</p>
                    <p className="text-lg font-medium text-green-400">{product.price}</p>
                    {product.id === 'kumi_six_10000' && (
                      <div className="mt-2 px-3 py-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md inline-flex items-center gap-2 mx-auto">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="font-semibold">WARNING:</span>
                        <span className="text-red-300">This product does not contain nicotine. It includes an alternative called NONIC6, an unregulated nicotine alternative.</span>
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardBody className="pt-0">
                <div className="mb-3">
                  {/* Flavor lists: special combined rendering for Fogger Switch Pro */}
                  {product.id === 'fogger_switch_pro_kit' ? (
                    (() => {
                      const pod = products.find((p) => p.id === 'fogger_switch_pod')
                      const kitFlavors = (product.flavors || []).filter((f) => f.in_stock)
                      const podFlavors = (pod?.flavors || []).filter((f) => f.in_stock)
                      return (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Kit Flavors:</h3>
                            <div className="space-y-1">
                              {kitFlavors.map((flavor: Flavor) => (
                                <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="text-gray-300">{flavor.name}</span>
                                  <span className="text-xs text-green-400">In Stock</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Pod Flavors:</h3>
                            <div className="space-y-1">
                              {podFlavors.map((flavor: Flavor) => (
                                <div key={flavor.id} className="flex items-center gap-2 text-xs">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="text-gray-300">{flavor.name}</span>
                                  <span className="text-xs text-green-400">In Stock</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()
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
          ))}
        </div>
      </div>
    </div>
  )
} 