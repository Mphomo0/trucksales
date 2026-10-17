'use client'

import dynamic from 'next/dynamic'

const loadEnquiryForm = () =>
  import('@/components/sections/inventorySection/EnquiryForm')

/**
 * The enquiry form sits behind a dialog, but its dependencies (react-hook-form,
 * zod, the resolver, Turnstile) were part of every detail page's initial JS.
 * Loading it on demand keeps them out of the critical path; call
 * `preloadEnquiryForm` on trigger hover/focus/touch so it is ready by the click.
 */
export const preloadEnquiryForm = () => {
  void loadEnquiryForm()
}

const LazyEnquiryForm = dynamic(loadEnquiryForm, {
  ssr: false,
  loading: () => (
    <p className="py-6 text-center text-sm text-gray-500">Loading form...</p>
  ),
})

export default LazyEnquiryForm
