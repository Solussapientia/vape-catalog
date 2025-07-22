import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'

interface SaveChangesPopupProps {
  changesCount: number
  onSave: () => void
  onDiscard: () => void
  saving: boolean
}

export default function SaveChangesPopup({ 
  changesCount, 
  onSave, 
  onDiscard, 
  saving 
}: SaveChangesPopupProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {changesCount} change{changesCount !== 1 ? 's' : ''} pending
          </Text>
          <Text style={styles.subtitle}>
            Save changes to update inventory
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onDiscard}
            style={[styles.discardButton, saving && styles.disabledButton]}
            disabled={saving}
          >
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onSave}
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
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
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
    backgroundColor: '#4A90E2',
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