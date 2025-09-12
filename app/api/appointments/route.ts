import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const appointments = await db.getAppointments()
    return NextResponse.json(appointments)
  } catch (error) {
    console.error("[v0] /api/appointments GET error:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body || {}
    if (id == null || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 })
    }

    await db.updateAppointmentStatus(id, status)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] /api/appointments POST error:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}
