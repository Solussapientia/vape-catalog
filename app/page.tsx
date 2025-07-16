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
      { name: 'Sour Strawberry Dragon', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Blue Razz Ice', inStock: true },
      { name: 'Fcuking Fab', inStock: true },
      { name: 'Pineapple Lime', inStock: true },
      { name: 'Dualicuous', inStock: true },
      { name: 'Pink Razz Lemonade', inStock: true },
      { name: 'Blueberry Punch', inStock: true },
      { name: 'Peach Gummy', inStock: true },
      { name: 'Crazy Berry', inStock: true },
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
      { name: 'Skywalker', inStock: true },
      { name: 'Strawberry Ice', inStock: true },
      { name: 'Triple Berry', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Sour Apple Ice', inStock: true },
      { name: 'Peach Blue Slushy', inStock: true },
      { name: 'Strawberry Watermelon Coconut', inStock: true },
      { name: 'Cherry Lemon Mint', inStock: true },
    ]
  },
  {
    id: 'pulse_x',
    name: 'Geek Bar Pulse X',
    puffs: '25,000 (Regular) / 15,000 (Pulse)',
    price: '$25 or 2 for $40',
    imageName: 'pulse_x',
    flavors: [
      { name: 'ATL Mint (Meteor / Patriot Edition)', inStock: false },
      { name: 'Banana Taffy Freeze', inStock: false },
      { name: 'Blackberry Blueberry', inStock: false },
      { name: 'Blackberry B‑Pop', inStock: false },
      { name: 'Blue Rancher', inStock: false },
      { name: 'Blue Razz Ice', inStock: false },
      { name: 'Cool Mint', inStock: false },
      { name: 'Cola Slush (Slush Edition)', inStock: false },
      { name: 'Grape Slush (Slush Edition)', inStock: false },
      { name: 'Orange Slush (Slush Edition)', inStock: false },
      { name: 'Peach Perfect Slush (Slush Edition)', inStock: false },
      { name: 'Wild Cherry Slush (Slush Edition)', inStock: false },
      { name: 'Grapefruit Refresher', inStock: false },
      { name: 'Lemon Heads', inStock: false },
      { name: 'Lime Berry Orange', inStock: false },
      { name: 'Miami Mint', inStock: false },
      { name: 'Orange Dragon (Meteor Edition)', inStock: false },
      { name: 'Orange Fcuking Fab', inStock: false },
      { name: 'Pink & Blue (Meteor Edition)', inStock: false },
      { name: 'Punch (Platinum Edition)', inStock: false },
      { name: 'Raspberry Peach Lime', inStock: false },
      { name: 'Sour Apple Ice', inStock: false },
      { name: 'Sour Fcuking Fab', inStock: false },
      { name: 'Sour Mango Pineapple', inStock: false },
      { name: 'Sour Straws', inStock: false },
      { name: 'Strawberry B‑Pop', inStock: false },
      { name: 'Strawberry Colada', inStock: false },
      { name: 'Strawberry Kiwi Ice (Meteor Edition)', inStock: false },
      { name: 'Strawberry Watermelon (Meteor Edition)', inStock: false },
      { name: 'Watermelon Ice', inStock: false },
      { name: 'White Peach Raspberry', inStock: false },
      { name: 'Strawberry Jam (Jam Edition)', inStock: false },
      { name: 'Blueberry Jam (Jam Edition)', inStock: false },
      { name: 'Raspberry Jam (Jam Edition)', inStock: false },
      { name: 'Peach Jam (Jam Edition)', inStock: false },
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
      { name: 'Sour Cranapple', inStock: true },
      { name: 'Creamy Mintz', inStock: true },
      { name: 'Black Mintz', inStock: true },
      { name: 'Stone Mintz', inStock: true },
      { name: 'Icy Mintz', inStock: true },
      { name: 'Watermelon Ice', inStock: false },
      { name: 'Fcuking FAB', inStock: false },
      { name: 'Wild Berry Savers', inStock: false },
      { name: 'Strawberry Savers', inStock: false },
      { name: 'Pineapple Savers', inStock: false },
      { name: 'Orange Mint Savers', inStock: false },
      { name: 'Spooky Vanilla', inStock: false },
      { name: 'Sour Gush', inStock: false },
      { name: 'Sour Blue Dust', inStock: false },
      { name: 'Sour Strawberry', inStock: false },
      { name: 'Sour Watermelon Drop', inStock: false },
      { name: 'Frozen Strawberry', inStock: false },
      { name: 'Frozen Pina Colada', inStock: false },
      { name: 'Frozen Cherry Apple', inStock: false },
      { name: 'Frozen Blackberry Fab', inStock: false },
      { name: 'Frozen Watermelon', inStock: false },
      { name: 'Frozen White Grape', inStock: false },
      { name: 'Sour Apple B‑Pop', inStock: false },
      { name: 'Grape Lemon', inStock: false },
      { name: 'Orange Creamsicle', inStock: false },
      { name: 'Dragon Melon', inStock: false },
      { name: 'OMG B‑Pop', inStock: false },
      { name: 'Grape B‑Pop', inStock: false },
      { name: 'Crazy Melon', inStock: false },
      { name: 'Black Cherry', inStock: false },
      { name: 'Blueberry Watermelon', inStock: false },
      { name: 'Berry Bliss', inStock: false },
      { name: 'Cherry Bomb', inStock: false },
      { name: 'Cool Mint', inStock: false },
      { name: 'Blue Razz Ice', inStock: false },
      { name: 'Miami Mint', inStock: false },
      { name: 'Pink Lemonade', inStock: false },
      { name: 'Mexico Mango', inStock: false },
      { name: 'Juicy Peach Ice', inStock: false },
      { name: 'Meta Moon', inStock: false },
      { name: 'California Cherry', inStock: false },
      { name: 'Blue Mint', inStock: false },
    ]
  },
  {
    id: 'meloso',
    name: 'Geek Bar Meloso',
    puffs: '30,000',
    price: '$25 or 2 for $40',
    imageName: 'meloso',
    flavors: [
      { name: 'Stone Freeze', inStock: true },
    ]
  },
  {
    id: 'ltx',
    name: 'Razz LTX',
    puffs: '25,000',
    price: '$20',
    imageName: 'LTX',
    flavors: [
      { name: 'Orange Pineapple Punch', inStock: true },
      { name: 'Orange Berry Lime Ice', inStock: true },
      { name: 'Frozen Cherry Apple', inStock: true },
      { name: 'Clear', inStock: true },
      { name: 'Tobacco', inStock: true },
      { name: 'Cherry Strapple', inStock: true },
      { name: 'Strawberry Orange Tang', inStock: true },
      { name: 'Black & Blue Lime', inStock: true },
      { name: 'Clear Sapphire', inStock: true },
      { name: 'Fire & Ice', inStock: true },
      { name: 'Pink Lemonade Minty O\'s', inStock: true },
      { name: 'Watermelon Ice', inStock: true },
      { name: 'Iced Blue Dragon', inStock: true },
      { name: 'Sour Watermelon Peach', inStock: true },
      { name: 'Frozen Banana', inStock: true },
      { name: 'Rainbow Rain', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Raspberry Limeade', inStock: true },
      { name: 'Strawberry Kiwi Pear', inStock: true },
      { name: 'Sour Apple Watermelon', inStock: true },
      { name: 'Sour Apple Ice', inStock: true },
      { name: 'Frozen Raspberry Watermelon', inStock: true },
      { name: 'Frozen Dragonfruit Lemon', inStock: true },
      { name: 'Bangin Sour Berries', inStock: true },
      { name: 'Blue Razz Ice', inStock: true },
      { name: 'Orange Mango', inStock: true },
    ]
  },
  {
    id: 'razz_mega',
    name: 'Razz Mega',
    puffs: '9,000',
    price: '$15.00',
    imageName: 'razz',
    flavors: [
      { name: 'Dragon Fruit Lemonade', inStock: true },
      { name: 'Tiffany', inStock: true },
      { name: 'Black Cherry Peach', inStock: true },
      { name: 'Strawberry Orange Mango', inStock: true },
      { name: 'Day Crawler', inStock: true },
      { name: 'Night Crawler', inStock: true },
      { name: 'Blueberry Watermelon', inStock: true },
      { name: 'Cactus Jack', inStock: true },
      { name: 'Mango Colada', inStock: true },
      { name: 'Peach Grapefruit', inStock: true },
      { name: 'Strawberry Watermelon', inStock: true },
      { name: 'Watermelon Ice', inStock: true },
      { name: 'Graham Twist', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Black Cherry Kiwi', inStock: true },
      { name: 'Georgia Peach', inStock: true },
      { name: 'Blue Razz B Pop', inStock: true },
      { name: 'White Gummy Watermelon', inStock: true },
      { name: 'White Yummy Grape', inStock: true },
    ]
  },
  {
    id: 'lm20000',
    name: 'Lost Mary MO20000',
    puffs: '20,000',
    price: '$20.00',
    imageName: 'LM20000',
    flavors: [
      { name: 'Tropical Punch', inStock: true },
      { name: 'Orange Pomegranate Cranberry', inStock: true },
      { name: 'Strawberry Kiwi', inStock: true },
      { name: 'Arizona Ice Tea', inStock: true },
      { name: 'Pure Ice', inStock: true },
      { name: 'Dragon Drink', inStock: true },
      { name: 'Blue Razz Ice', inStock: true },
      { name: 'Miami Mint', inStock: true },
      { name: 'Grape Jelly', inStock: true },
      { name: 'Sour Strawberry Dragon', inStock: true },
      { name: 'Sour Apple Ice', inStock: true },
      { name: 'Watermelon Sour Peach', inStock: true },
      { name: 'Strawberry Ice', inStock: true },
      { name: 'Peach +', inStock: true },
      { name: 'Rocket Popsicle', inStock: true },
      { name: 'Pure', inStock: true },
      { name: 'Lime Grapefruit', inStock: true },
      { name: 'Pear Drop', inStock: true },
      { name: 'Luxury Tobacco', inStock: true },
      { name: 'Red Wave', inStock: true },
      { name: 'Pina Colada', inStock: true },
      { name: 'Blue Baja Splash', inStock: true },
      { name: 'Mountain Berry', inStock: true },
      { name: 'Deep Purple', inStock: true },
      { name: 'Hawaiian Popsicle', inStock: true },
      { name: 'Peppermint', inStock: true },
      { name: 'Rainbow Sherbert', inStock: true },
      { name: 'Pineapple Ice', inStock: true },
      { name: 'Scarry Berry', inStock: true },
    ]
  },
  {
    id: 'lmmt15000',
    name: 'Lost Mary MT15000 Turbo',
    puffs: '15,000',
    price: '$15.00',
    imageName: 'LMMT',
    flavors: [
      { name: 'Grape Jelly', inStock: true },
      { name: 'Tropical Baja Splash', inStock: true },
      { name: 'Wild Berry Baja Splash', inStock: true },
      { name: 'Acai Storm Ice', inStock: true },
      { name: 'Hawaii Juice', inStock: true },
      { name: 'Refresh Fcucking Fab', inStock: true },
      { name: 'Peach Blue Slushy', inStock: true },
      { name: 'Sour Strawberry Peach', inStock: true },
      { name: 'Green Apple Lime', inStock: true },
      { name: 'Berry Burst', inStock: true },
      { name: 'Pacific Cooler', inStock: true },
      { name: 'Blueberry Raspberry Lemon', inStock: true },
      { name: 'Grape Apple', inStock: true },
      { name: 'Rainbow Bubblegum', inStock: true },
      { name: 'Grapefruit Berries', inStock: true },
      { name: 'Red Strawberry', inStock: true },
      { name: 'Purple Passion Punch', inStock: true },
      { name: 'Raspberry Watermelon', inStock: true },
      { name: 'Citrus Sunrise', inStock: true },
      { name: 'Summer Grape', inStock: true },
      { name: 'Yellow Lemon', inStock: true },
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
              <CardHeader className="flex flex-col gap-4 pb-4">
                <div className="w-full aspect-square relative border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={`/${product.imageName}.webp`}
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