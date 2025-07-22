import React, { useState, useEffect } from 'react'
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  StatusBar 
} from 'react-native'
import { supabase, VapeProduct, Flavor } from './lib/supabase'

interface FlavorChange {
  id: string
  productName: string
  flavorName: string
  newStock: boolean
}

export default function App() {
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading vape products...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
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
        <View style={styles.saveContainer}>
          <View style={styles.saveContent}>
            <View style={styles.saveTextContainer}>
              <Text style={styles.saveTitle}>
                {changes.length} change{changes.length !== 1 ? 's' : ''} pending
              </Text>
              <Text style={styles.saveSubtitle}>
                Save changes to update inventory
              </Text>
            </View>
            
            <View style={styles.saveButtonContainer}>
              <TouchableOpacity
                onPress={discardChanges}
                style={[styles.discardButton, saving && styles.disabledButton]}
                disabled={saving}
              >
                <Text style={styles.discardButtonText}>Discard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={saveChanges}
                style={[styles.saveButton, saving && styles.disabledButton]}
                disabled={saving}
              >
                <View style={styles.saveButtonContent}>
                  {saving && <ActivityIndicator size="small" color="white" style={styles.spinner} />}
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    marginVertical: 16,
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
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 20,
  },
  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  saveTextContainer: {
    flex: 1,
  },
  saveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  saveSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  saveButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  discardButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  discardButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  spinner: {
    marginRight: 8,
  },
}) 