import React, { useEffect } from 'react'

interface FlavorInfoModalProps {
  isOpen: boolean
  onClose: () => void
  flavorName: string
  productName: string
  description?: string
}

export default function FlavorInfoModal({ 
  isOpen, 
  onClose, 
  flavorName, 
  productName, 
  description 
}: FlavorInfoModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gray-900 rounded-xl p-5 max-w-md w-full border border-gray-700 shadow-2xl pointer-events-auto transform transition-all modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {flavorName}
              </h3>
              <p className="text-sm text-gray-400">
                {productName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="text-gray-300 text-sm leading-relaxed">
            {description ? (
              <p>{description}</p>
            ) : (
              <p className="text-gray-500 italic">
                No flavor description available yet.
              </p>
            )}
          </div>
          
          {/* Footer */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
