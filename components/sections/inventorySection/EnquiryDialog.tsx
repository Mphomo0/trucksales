'use client'

import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import EnquiryForm, {
  preloadEnquiryForm,
} from '@/components/sections/inventorySection/LazyEnquiryForm'

export default function EnquiryDialog({ vehicleSlug }: { vehicleSlug: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onPointerEnter={preloadEnquiryForm}
          onFocus={preloadEnquiryForm}
          onTouchStart={preloadEnquiryForm}
          variant="outline"
          className="w-full bg-transparent mt-4"
          size="lg"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Dealer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 overscroll-contain">
        <DialogHeader>
          <DialogTitle>Enquire About This Vehicle</DialogTitle>
          <DialogDescription>
            Send us your details and we&apos;ll confirm availability, viewing
            and pricing.
          </DialogDescription>
        </DialogHeader>
        <EnquiryForm vehicleSlug={vehicleSlug} />
      </DialogContent>
    </Dialog>
  )
}
