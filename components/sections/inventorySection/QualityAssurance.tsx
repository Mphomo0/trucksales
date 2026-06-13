/* author: A-Z Truck Sales */
/* datePublished: 2026-05-15 */

import React from 'react'
import { CheckCircle2, ShieldCheck, Settings2, Award } from 'lucide-react'

export default function QualityAssurance() {
  return (
    <section className="py-12 bg-neutral-50 border-t border-b mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose A-Z Truck Sales?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            With over 25 years of specialized experience in the commercial vehicle industry, 
            we provide more than just a truck—we provide reliability for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-lg shrink-0">
                <Settings2 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Workshop-Tested Guarantee</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every vehicle in our inventory undergoes a rigorous workshop inspection process 
                  by our experienced technicians. Before any truck is listed for sale, it is 
                  thoroughly serviced in our Alberton-based facility. We ensure that all major 
                  components, including the engine, gearbox, and differential, are in optimal 
                  working condition. Our team of specialists performs comprehensive checks 
                  to guarantee that every vehicle meets our high standards of quality and performance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg shrink-0">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">COF Certification Ready</h3>
                <p className="text-gray-600 leading-relaxed">
                  We understand the critical importance of safety and compliance in commercial logistics. 
                  We ensure that all our trucks are prepared to pass their Certificate of Fitness (COF) 
                  inspection. This commitment to quality means you can buy with total confidence, 
                  knowing that your vehicle is compliant with South African road safety regulations 
                  and ready to start working for your business immediately without hidden maintenance costs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">25+ Years of Expertise</h3>
                <p className="text-gray-600 leading-relaxed">
                  A-Z Truck Sales has been a cornerstone of the Gauteng commercial vehicle market 
                  for over two decades. Our long-standing reputation is built on transparency, 
                  fair pricing, and expert knowledge of rigid trucks ranging from 1.5 to 35 tons.
                  Our deep understanding of brands like Isuzu, Hino, Mercedes-Benz, Ford, MAN, Fuso, Toyota and Nissan allows 
                  us to source and prepare the best used trucks available in South Africa today.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg shrink-0">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Restoration & Customization</h3>
                <p className="text-gray-600 leading-relaxed">
                  As specialists in truck restoration, we don't just sell trucks; we revitalize them. 
                  Whether you need a specific body type or customized configurations for specialized 
                  logistics, our in-house workshop can handle adjustments to suit your needs. 
                  We offer a comprehensive approach to vehicle sales, ensuring that the truck 
                  you purchase is perfectly suited for the specific demands of your industry and cargo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Looking for a specific configuration?</h3>
          <p className="text-amber-50 mb-6 max-w-2xl mx-auto">
            Our expert team can help you source and customize the perfect truck for your business. 
            Contact us today to discuss your requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:0119026071" 
              className="bg-white text-amber-600 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition-colors"
            >
              Call 011 902 6071
            </a>
            <a 
              href="/sell-your-truck" 
              className="bg-amber-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-800 transition-colors border border-amber-500"
            >
              Trade-In Your Truck
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
