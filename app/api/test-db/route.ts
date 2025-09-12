import { NextResponse } from "next/server"
import { testConnection } from "@/lib/database"

export async function GET() {
  try {
    const ok = await testConnection()
    return NextResponse.json({ connected: ok })
  } catch (error) {
    console.error("[v0] /api/test-db error:", error)
    return NextResponse.json({ connected: false, error: String(error) }, { status: 500 })
  }
}
