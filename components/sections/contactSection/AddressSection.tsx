/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Branch {
  id: string
  name: string
  address: string
  city: string
  phone: string
  coords: { lat: string; lng: string }
}

const branches: Branch[] = [
  {
    id: 'alberton',
    name: 'Alberton',
    address: '9 Chrislou Crescent, Alberton North',
    city: 'Gauteng, 1449',
    phone: '011 902 6071',
    coords: { lat: '-26.2563', lng: '28.1389' },
  },
  {
    id: 'boksburg',
    name: 'Boksburg',
    address: 'Cnr Trichardts & Ravenswood St, Ravenswood',
    city: 'Gauteng, 1451',
    phone: '083 234 5377',
    coords: { lat: '-26.1913', lng: '28.2488' },
  },
]

export default function AddressSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const openModal = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBranch(null)
  }

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="contact-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-3">Phone</h3>
            <div className="space-y-1 text-center">
              <p className="text-gray-600">011 902 6071</p>
              <p className="text-gray-600 text-sm">Alberton: 078 127 7393</p>
              <p className="text-gray-600 text-sm">Boksburg: 083 234 5377</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-3">Email</h3>
            <div className="space-y-1 text-center">
              <a
                href="mailto:aztrucksales@mweb.co.za"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                aztrucksales@mweb.co.za
              </a>
              <p className="text-xs text-gray-400">We respond within 24 hours</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-3">Alberton</h3>
            <div className="space-y-1 text-center mb-4">
              <p className="text-gray-600 text-sm">9 Chrislou Crescent</p>
              <p className="text-gray-400 text-sm">Alberton, Gauteng</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50"
              onClick={() => openModal(branches[0])}
            >
              View Map
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-3">Boksburg</h3>
            <div className="space-y-1 text-center mb-4">
              <p className="text-gray-600 text-sm">Cnr Trichardts & Ravenswood</p>
              <p className="text-gray-400 text-sm">Boksburg, Gauteng</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50"
              onClick={() => openModal(branches[1])}
            >
              View Map
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div className="text-center">
              <p className="font-medium text-gray-900">Business Hours</p>
              <p className="text-gray-600 text-sm">Mon – Fri: 8:00 AM – 5:00 PM</p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedBranch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Close map"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedBranch.name} Branch
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedBranch.address}, {selectedBranch.city}
                </p>
              </div>

              <div className="h-[400px] w-full">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.1659030161427!2d${selectedBranch.coords.lng}!3d${selectedBranch.coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9510722a7fd44d%3A0xd8a035093db1dfcd!2s9%20Chrislou%20Cres%2C%20Alberton%2C%201449!5e0!3m2!1sen!2sza!4v1756405416361!5m2!1sen!2sza`}
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedBranch.phone}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedBranch.coords.lat},${selectedBranch.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                >
                  Open in Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
