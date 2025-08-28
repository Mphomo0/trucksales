'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function AddressSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mapLocation, setMapLocation] = useState('')

  // Function to open the modal with a specific map location
  const openModal = (location: string) => {
    setMapLocation(location)
    setIsModalOpen(true)
  }

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false)
    setMapLocation('')
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-labelledby="contact-heading"
    >
      <div className="text-center mb-12">
        <h2
          id="contact-heading"
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Contact Us
        </h2>
        <p className="text-lg text-gray-600">
          Ready to purchase your perfect truck? Get in touch with us today!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Call Us */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <Phone className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Call Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">011 902 6071</p>
            <p className="text-lg font-medium">Alberton: 078 127 7393</p>
            <p className="text-lg font-medium">Boksburg: 083 234 5377</p>
            <p className="text-sm text-gray-500">Mon–Fri: 8AM–5PM</p>
            <p className="text-sm text-gray-500">Sat–Sun: Closed</p>
          </CardContent>
        </Card>

        {/* Email Us */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <Mail className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Email Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">aztrucksales@mweb.co.za</p>
            <p className="text-sm text-gray-500">We respond within 24 hours</p>
          </CardContent>
        </Card>

        {/* Alberton Branch */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <MapPin className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Alberton Branch</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">
              9 Chrislou Crescent, Alberton North
            </p>
            <p className="text-sm text-gray-500">Alberton, Gauteng, 1449</p>
            <Button className="my-4 p-5" onClick={() => openModal('alberton')}>
              Visit Alberton Branch
            </Button>
          </CardContent>
        </Card>

        {/* Boksburg Branch */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center">
            <MapPin className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <CardTitle>Boksburg Branch</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-1">
            <p className="text-lg font-medium">
              Cnr Trichardts & Ravenswood St, Ravenswood
            </p>
            <p className="text-sm text-gray-500">Boksburg, Gauteng, 1451</p>
            <Button className="my-4 p-5" onClick={() => openModal('boksburg')}>
              Visit Boksburg Branch
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-3/4 max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl font-bold text-gray-600"
            >
              &times;
            </button>

            {/* Conditional map based on the selected branch */}
            {mapLocation === 'alberton' ? (
              <div>
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Alberton Branch
                </h2>
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.1659030161427!2d28.13892337541691!3d-26.256278477044486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9510722a7fd44d%3A0xd8a035093db1dfcd!2s9%20Chrislou%20Cres%2C%20Alberton%2C%201449!5e0!3m2!1sen!2sza!4v1756405416361!5m2!1sen!2sza"
                  allowFullScreen
                ></iframe>
              </div>
            ) : mapLocation === 'boksburg' ? (
              <div>
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Boksburg Branch
                </h2>
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7160.33222406436!2d28.248800020438615!3d-26.191274132331046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9517a1cf6334c3%3A0x9fff6f42aafa7e45!2sA-Z%20Truck%20Sales%20Boksburg!5e0!3m2!1sen!2sza!4v1756405725892!5m2!1sen!2sza"
                  allowFullScreen
                ></iframe>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}
