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
  const imageMap: { [key: string]: string } = {
    'ria': '/ria.webp',
    'skyview': '/skyview.webp', 
    'pulse_x': '/pulse_x.webp',
    'pulse': '/pulse.webp',
    'meloso': '/meloso.webp',
    'LTX': '/LTX.webp',
    'razz': '/razz.webp',
    'LM20000': '/LM20000.webp',
    'LMMT': '/LMMT.webp',
    'mo5000': '/mo5000.webp',
    'losgal': '/losgal.webp',
    'SP.jpg': '/SP.jpg',
    'S.jpg': '/S.jpg',
    'T': '/T.webp',
    'hyde': '/hyde.webp'
  }
  
  return imageMap[imageName] || `/default.webp`
}

export default function Home() {
  const [products, setProducts] = useState<VapeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      setProducts(productsData || [])
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
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            VAPE LIST
          </h1>
          <p className="text-gray-400 text-sm">Premium vape products</p>
        </div>

        {/* Product Cards */}
        <div className="space-y-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-col gap-4 pb-4">
                <div className="w-full aspect-square relative border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={getImagePath(product.image_name)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-xl font-semibold text-white mb-1">{product.name}</p>
                  <p className="text-base text-gray-400 mb-1">{product.puffs} puffs</p>
                  <p className="text-lg font-medium text-green-400">{product.price}</p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Available Flavors:</h3>
                  <div className="space-y-1">
                    {product.flavors?.map((flavor) => (
                      <div key={flavor.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${flavor.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-gray-300">{flavor.name}</span>
                        <span className={`text-xs ${flavor.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                          {flavor.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 