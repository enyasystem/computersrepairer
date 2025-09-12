"use server"

import { db } from "@/lib/database"

export async function createAppointment(formData: FormData) {
  const appointmentData = {
    customer_name: formData.get("customer_name") as string,
    customer_email: formData.get("customer_email") as string,
    customer_phone: formData.get("customer_phone") as string,
    service_type: formData.get("service_type") as string,
    device_type: formData.get("device_type") as string,
    device_model: formData.get("device_model") as string,
    issue_description: formData.get("issue_description") as string,
    preferred_date: formData.get("preferred_date") as string,
    preferred_time: formData.get("preferred_time") as string,
    appointment_type: formData.get("appointment_type") as string,
    notes: formData.get("notes") as string,
  }

  try {
    await db.createAppointment(appointmentData)
    console.log("[v0] Appointment created successfully")
  } catch (error) {
    console.error("[v0] Failed to create appointment:", error)
    throw new Error("Failed to create appointment")
  }
}
