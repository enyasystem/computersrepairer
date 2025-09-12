"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { createAppointment } from "@/app/book-appointment/actions"

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await createAppointment(formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Failed to create appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">Appointment Request Submitted!</h3>
            <p className="text-muted-foreground">
              Thank you for your appointment request. We'll contact you within 2 hours to confirm your appointment
              details.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
              Book Another Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Full Name *</Label>
            <Input id="customer_name" name="customer_name" required placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_email">Email Address *</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              required
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer_phone">Phone Number</Label>
          <Input id="customer_phone" name="customer_phone" type="tel" placeholder="(555) 123-4567" />
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Appointment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appointment_type">Appointment Type *</Label>
            <Select name="appointment_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="drop-off">Drop-off</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="service_type">Service Type *</Label>
            <Select name="service_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop-repair">Laptop Repair</SelectItem>
                <SelectItem value="desktop-repair">Desktop Repair</SelectItem>
                <SelectItem value="data-recovery">Data Recovery</SelectItem>
                <SelectItem value="virus-removal">Virus Removal</SelectItem>
                <SelectItem value="hardware-upgrade">Hardware Upgrade</SelectItem>
                <SelectItem value="software-installation">Software Installation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferred_date">Preferred Date *</Label>
            <Input
              id="preferred_date"
              name="preferred_date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred_time">Preferred Time *</Label>
            <Select name="preferred_time" required>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
                <SelectItem value="17:00">5:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Device Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Device Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="device_type">Device Type</Label>
            <Select name="device_type">
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="device_model">Device Model</Label>
            <Input id="device_model" name="device_model" placeholder="e.g., MacBook Pro 2021, Dell XPS 13" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="issue_description">Issue Description</Label>
          <Textarea
            id="issue_description"
            name="issue_description"
            placeholder="Please describe the issue you're experiencing with your device..."
            rows={4}
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Any additional information or special requests..." rows={3} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Book Appointment"}
      </Button>
    </form>
  )
}
