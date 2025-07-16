'use client'

import { Card, CardBody, CardHeader, Chip } from '@heroui/react'
import Image from 'next/image'
import React from 'react'

interface Flavor {
  name: string
  inStock: boolean
}

interface VapeProduct {
  id: string
  name: string
  puffs: string
  price: string
  imageName: string
  flavors: Flavor[]
}

const vapeProducts: VapeProduct[] = [
  {
    id: 'ria',
    name: 'Geek Bar Ria',
    puffs: '30,000',
    price: '$25.00 or 2 for $40',
    imageName: 'ria',
    flavors: [
      { name: 'Blue Raz Ice', inStock: true },
      { name: 'Blueberry Punch', inStock: true },
      { name: 'Crazy Berry', inStock: false },
      { name: 'Dualicious (Watermelon Honeydew)', inStock: true },
      { name: 'Fcuking Fab (mystery tropical fruit blend)', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Peach Gummy', inStock: false },
      { name: 'Pineapple Lime', inStock: true },
      { name: 'Pink Raz Lemonade', inStock: true },
      { name: 'Sour Strawberry Dragon', inStock: false },
      { name: 'Watermelon B‑Pop', inStock: true },
      { name: 'Watermelon Ice', inStock: true },
    ]
  },
  {
    id: 'skyview',
    name: 'Digiflavor Skyview',
    puffs: '25,000',
    price: '$20.00',
    imageName: 'skyview',
    flavors: [
      { name: 'Blackberry Fcuking Fab', inStock: true },
      { name: 'Blue Razz Ice', inStock: true },
      { name: 'Cherry Lemon Mint', inStock: false },
      { name: 'Cherry Strazz', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Peach Blue Slushy', inStock: true },
      { name: 'Peach Raspberry', inStock: false },
      { name: 'Sky Walker', inStock: true },
      { name: 'Sour Apple Ice', inStock: true },
      { name: 'Sour Watermelon Blue Razz', inStock: false },
      { name: 'Strawberry Banana', inStock: true },
      { name: 'Strawberry Ice', inStock: true },
      { name: 'Strawberry Watermelon Coconut', inStock: true },
      { name: 'Triple Berry', inStock: false },
      { name: 'Twisted B‑Pop', inStock: true },
    ]
  },
  {
    id: 'pulse_x',
    name: 'Geek Bar Pulse X',
    puffs: '25,000 (Regular) / 15,000 (Pulse)',
    price: '$25 or 2 for $40',
    imageName: 'pulse_x',
    flavors: [
      { name: 'ATL Mint (Meteor / Patriot Edition)', inStock: true },
      { name: 'Banana Taffy Freeze', inStock: false },
      { name: 'Blackberry Blueberry', inStock: true },
      { name: 'Blackberry B‑Pop', inStock: true },
      { name: 'Blue Rancher', inStock: true },
      { name: 'Blue Razz Ice', inStock: true },
      { name: 'Cool Mint', inStock: true },
      { name: 'Cola Slush (Slush Edition)', inStock: false },
      { name: 'Grape Slush (Slush Edition)', inStock: false },
      { name: 'Orange Slush (Slush Edition)', inStock: false },
      { name: 'Peach Perfect Slush (Slush Edition)', inStock: true },
      { name: 'Wild Cherry Slush (Slush Edition)', inStock: true },
      { name: 'Grapefruit Refresher', inStock: true },
      { name: 'Lemon Heads', inStock: false },
      { name: 'Lime Berry Orange', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Orange Dragon (Meteor Edition)', inStock: true },
      { name: 'Orange Fcuking Fab', inStock: true },
      { name: 'Pink & Blue (Meteor Edition)', inStock: false },
      { name: 'Punch (Platinum Edition)', inStock: true },
      { name: 'Raspberry Peach Lime', inStock: true },
      { name: 'Sour Apple Ice', inStock: true },
      { name: 'Sour Fcuking Fab', inStock: true },
      { name: 'Sour Mango Pineapple', inStock: false },
      { name: 'Sour Straws', inStock: true },
      { name: 'Strawberry B‑Pop', inStock: true },
      { name: 'Strawberry Colada', inStock: true },
      { name: 'Strawberry Kiwi Ice (Meteor Edition)', inStock: false },
      { name: 'Strawberry Watermelon (Meteor Edition)', inStock: true },
      { name: 'Watermelon Ice', inStock: true },
      { name: 'White Peach Raspberry', inStock: true },
      { name: 'Strawberry Jam (Jam Edition)', inStock: true },
      { name: 'Blueberry Jam (Jam Edition)', inStock: false },
      { name: 'Raspberry Jam (Jam Edition)', inStock: true },
      { name: 'Peach Jam (Jam Edition)', inStock: true },
      { name: 'Orange Jam (Jam Edition)', inStock: false },
    ]
  },
  {
    id: 'pulse',
    name: 'Geek Bar Pulse',
    puffs: '15,000 (Regular) / 7,500 (Pulse)',
    price: '$20 or 2 for $35',
    imageName: 'pulse',
    flavors: [
      { name: 'Watermelon Ice', inStock: true },
      { name: 'Fcuking FAB', inStock: true },
      { name: 'Wild Berry Savers', inStock: false },
      { name: 'Strawberry Savers', inStock: true },
      { name: 'Pineapple Savers', inStock: true },
      { name: 'Orange Mint Savers', inStock: false },
      { name: 'Spooky Vanilla', inStock: true },
      { name: 'Sour Cranapple', inStock: true },
      { name: 'Sour Gush', inStock: true },
      { name: 'Sour Blue Dust', inStock: false },
      { name: 'Sour Strawberry', inStock: true },
      { name: 'Sour Watermelon Drop', inStock: true },
      { name: 'Frozen Strawberry', inStock: true },
      { name: 'Frozen Pina Colada', inStock: false },
      { name: 'Frozen Cherry Apple', inStock: true },
      { name: 'Frozen Blackberry Fab', inStock: true },
      { name: 'Frozen Watermelon', inStock: true },
      { name: 'Frozen White Grape', inStock: false },
      { name: 'Sour Apple B‑Pop', inStock: true },
      { name: 'Grape Lemon', inStock: true },
      { name: 'Orange Creamsicle', inStock: true },
      { name: 'Dragon Melon', inStock: false },
      { name: 'OMG B‑Pop', inStock: true },
      { name: 'Grape B‑Pop', inStock: true },
      { name: 'Crazy Melon', inStock: true },
      { name: 'Black Cherry', inStock: false },
      { name: 'Blueberry Watermelon', inStock: true },
      { name: 'Berry Bliss', inStock: true },
      { name: 'Cherry Bomb', inStock: true },
      { name: 'Cool Mint', inStock: true },
      { name: 'Blue Razz Ice', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Pink Lemonade', inStock: false },
      { name: 'Mexico Mango', inStock: true },
      { name: 'Juicy Peach Ice', inStock: true },
      { name: 'Meta Moon', inStock: true },
      { name: 'California Cherry', inStock: false },
      { name: 'Blue Mint', inStock: true },
    ]
  }
]

export default function Home() {
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
          {vapeProducts.map((product) => (
            <Card key={product.id} className="bg-gray-900 border-gray-800">
              <CardHeader className="flex gap-3 pb-2">
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <Image
                    src={`/${product.imageName}.webp`}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-lg font-semibold text-white">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.puffs} puffs</p>
                  <p className="text-sm font-medium text-green-400">{product.price}</p>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Available Flavors:</h3>
                  <div className="space-y-1">
                    {product.flavors.map((flavor, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${flavor.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-gray-300">{flavor.name}</span>
                        <span className={`text-xs ${flavor.inStock ? 'text-green-400' : 'text-red-400'}`}>
                          {flavor.inStock ? 'In Stock' : 'Out of Stock'}
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