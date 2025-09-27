'use client'

import React, { useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AddBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

function slugifyId(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

export default function AddBrandModal({ isOpen, onClose, onSaved }: AddBrandModalProps) {
  const [brandName, setBrandName] = useState('')
  const [price, setPrice] = useState('')
  const [puffs, setPuffs] = useState('')
  const [imageUrlOrName, setImageUrlOrName] = useState('')
  const [flavors, setFlavors] = useState<string[]>([''])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const productId = useMemo(() => slugifyId(brandName || ''), [brandName])

  if (!isOpen) return null

  function handleAddFlavor() {
    setFlavors((prev) => [...prev, ''])
  }

  function handleFlavorChange(index: number, value: string) {
    setFlavors((prev) => prev.map((f, i) => (i === index ? value : f)))
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError(null)

      const trimmedName = brandName.trim()
      const trimmedPrice = price.trim()
      const trimmedPuffs = puffs.trim()
      if (!trimmedName || !trimmedPrice || !trimmedPuffs) {
        setError('Please fill name, price, and puffs.')
        setSaving(false)
        return
      }

      if (!productId) {
        setError('Could not derive a valid ID from the brand name.')
        setSaving(false)
        return
      }

      // Determine image_name: try upload if a file is chosen; otherwise use provided URL/filename
      let image_name: string = ''
      const file = fileInputRef.current?.files && fileInputRef.current.files[0]
      if (file) {
        const ext = file.name.split('.').pop() || 'webp'
        const path = `product-images/${productId}-${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('public').upload(path, file, { upsert: true })
        if (uploadErr) {
          setError(`Image upload failed: ${uploadErr.message}. You can instead paste an image URL or a filename in /public.`)
          setSaving(false)
          return
        }
        image_name = `https://thpcdtctcfsaykkgjvaa.supabase.co/storage/v1/object/public/${path}`
      } else if (imageUrlOrName.trim()) {
        image_name = imageUrlOrName.trim()
      } else {
        // Fallback to default image if nothing provided
        image_name = 'default.webp'
      }

      // Upsert product
      const { error: upsertErr } = await supabase
        .from('products')
        .upsert({ id: productId, name: trimmedName, price: trimmedPrice, puffs: trimmedPuffs, image_name })
      if (upsertErr) {
        setError(`Save failed: ${upsertErr.message}`)
        setSaving(false)
        return
      }

      // Insert flavors
      const flavorNames = flavors
        .map((f) => f.trim())
        .filter((f) => f.length > 0)
      if (flavorNames.length > 0) {
        const rows = flavorNames.map((name) => ({ product_id: productId, name, in_stock: true }))
        const { error: flavorsErr } = await supabase.from('flavors').insert(rows)
        if (flavorsErr) {
          setError(`Flavors save failed: ${flavorsErr.message}`)
          setSaving(false)
          return
        }
      }

      onSaved()
      onClose()
      // Reset form
      setBrandName('')
      setPrice('')
      setPuffs('')
      setImageUrlOrName('')
      setFlavors([''])
    } catch (e: any) {
      setError(e?.message || 'Unexpected error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-5 max-w-sm w-full border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-3">Add New Brand</h3>

        {error && (
          <div className="mb-3 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Brand name</label>
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              placeholder="e.g., Hyde IQ"
            />
            <p className="mt-1 text-[11px] text-gray-500">ID: {productId || '—'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="$19.99"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Puffs</label>
              <input
                value={puffs}
                onChange={(e) => setPuffs(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="10000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700"
            />
            <input
              value={imageUrlOrName}
              onChange={(e) => setImageUrlOrName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              placeholder="Or paste image URL or filename in /public, e.g., mo5000.webp"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Flavors</label>
            <div className="space-y-2">
              {flavors.map((flavor, idx) => (
                <input
                  key={idx}
                  value={flavor}
                  onChange={(e) => handleFlavorChange(idx, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  placeholder={`Flavor ${idx + 1}`}
                />
              ))}
              <button
                onClick={handleAddFlavor}
                className="w-full text-center bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-md text-sm"
              >
                Add another flavor
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}


