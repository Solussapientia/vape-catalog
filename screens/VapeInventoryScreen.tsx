import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, Alert, Switch, TouchableOpacity, ActivityIndicator } from 'react-native'
import { supabase, VapeProduct, Flavor } from '../lib/supabase'
import SaveChangesPopup from '../components/SaveChangesPopup'

interface FlavorChange {
  id: string
  productName: string
  flavorName: string
  newStock: boolean
}

export default function VapeInventoryScreen() {
  const [products, setProducts] = useState<VapeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [changes, setChanges] = useState<FlavorChange[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      
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

  function handleFlavorToggle(productId: string, productName: string, flavor: Flavor, newStock: boolean) {
    // Update local state immediately for UI responsiveness
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? {
            ...product,
            flavors: product.flavors.map(f => 
              f.id === flavor.id ? { ...f, in_stock: newStock } : f
            )
          }
        : product
    ))

    // Track changes
    setChanges(prev => {
      const existingChangeIndex = prev.findIndex(change => change.id === flavor.id)
      const newChange: FlavorChange = {
        id: flavor.id,
        productName,
        flavorName: flavor.name,
        newStock
      }

      if (existingChangeIndex >= 0) {
        // Update existing change
        const updatedChanges = [...prev]
        updatedChanges[existingChangeIndex] = newChange
        return updatedChanges
      } else {
        // Add new change
        return [...prev, newChange]
      }
    })
  }

  async function saveChanges() {
    if (changes.length === 0) return

    setSaving(true)
    try {
      for (const change of changes) {
        const { error } = await supabase
          .from('flavors')
          .update({ in_stock: change.newStock })
          .eq('id', change.id)

        if (error) {
          throw error
        }
      }

      setChanges([])
      Alert.alert('Success', 'Changes saved successfully!')
    } catch (err) {
      console.error('Error saving changes:', err)
      Alert.alert('Error', 'Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function discardChanges() {
    setChanges([])
    fetchProducts() // Reload original data
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading vape products...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>VAPE LIST</Text>
        <Text style={styles.subtitle}>Inventory Management</Text>
      </View>

      {/* Product List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productInfo}>{product.puffs} puffs • {product.price}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.flavorsTitle}>Flavors:</Text>
              {product.flavors?.map((flavor) => (
                <View key={flavor.id} style={styles.flavorRow}>
                  <Text style={styles.flavorName}>{flavor.name}</Text>
                  <Switch
                    value={flavor.in_stock}
                    onValueChange={(newStock) => 
                      handleFlavorToggle(product.id, product.name, flavor, newStock)
                    }
                    trackColor={{ false: '#767577', true: '#4CAF50' }}
                    thumbColor={flavor.in_stock ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Save Changes Popup */}
      {changes.length > 0 && (
        <SaveChangesPopup
          changesCount={changes.length}
          onSave={saveChanges}
          onDiscard={discardChanges}
          saving={saving}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  productInfo: {
    fontSize: 14,
    color: '#888',
  },
  cardBody: {
    paddingTop: 0,
  },
  flavorsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 12,
  },
  flavorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  flavorName: {
    fontSize: 14,
    color: '#ddd',
    flex: 1,
  },
  loadingText: {
    color: '#888',
    marginTop: 10,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}) 