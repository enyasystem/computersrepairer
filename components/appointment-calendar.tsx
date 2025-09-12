"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, Wrench } from "lucide-react"
import { db } from "@/lib/database"

interface Appointment {
  id: number
  customer_name: string
  service_type: string
  preferred_date: string
  preferred_time: string
  appointment_type: string
  status: string
}

interface AppointmentCalendarProps {
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
  showAppointments?: boolean
}

export function AppointmentCalendar({ onDateSelect, selectedDate, showAppointments = true }: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showAppointments) {
      loadAppointments()
    }
  }, [showAppointments])

  useEffect(() => {
    if (date && showAppointments) {
      loadDayAppointments(date)
    }
  }, [date, appointments, showAppointments])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const appointmentsData = await db.getAppointments()
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("[v0] Failed to load appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDayAppointments = async (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const dayAppts = appointments.filter((apt) => apt.preferred_date === dateString)
    setDayAppointments(dayAppts)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      onDateSelect?.(selectedDate)
    }
  }

  const getAppointmentDates = () => {
    return appointments.map((apt) => new Date(apt.preferred_date))
  }

  const hasAppointments = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return appointments.some((apt) => apt.preferred_date === dateString)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <User className="h-3 w-3" />
      case "drop-off":
        return <Wrench className="h-3 w-3" />
      case "pickup":
        return <Clock className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Calendar
          </CardTitle>
          <CardDescription>
            {showAppointments ? "Select a date to view appointments" : "Choose your preferred appointment date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates for booking
              if (!showAppointments) {
                return date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              return false
            }}
            modifiers={
              showAppointments
                ? {
                    hasAppointments: getAppointmentDates(),
                  }
                : undefined
            }
            modifiersStyles={
              showAppointments
                ? {
                    hasAppointments: {
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      fontWeight: "bold",
                    },
                  }
                : undefined
            }
          />
          {showAppointments && (
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span>Days with appointments</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day's Appointments */}
      {showAppointments && (
        <Card>
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a Date"}
            </CardTitle>
            <CardDescription>
              {dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading appointments...</div>
              ) : dayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {dayAppointments
                    .sort((a, b) => a.preferred_time.localeCompare(b.preferred_time))
                    .map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAppointmentTypeIcon(appointment.appointment_type)}
                            <span className="font-medium text-sm">{appointment.preferred_time}</span>
                          </div>
                          <Badge variant={getStatusColor(appointment.status)} className="text-xs">
                            {appointment.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{appointment.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.service_type.replace("-", " ")} • {appointment.appointment_type}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No appointments</h3>
                  <p className="text-sm text-muted-foreground">No appointments scheduled for this date.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
