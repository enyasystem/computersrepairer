"use client"

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react'

type PendingMenu = {
  id: number
  rect?: DOMRect | null
}

export default function AppointmentsActionPortal() {
  const [menu, setMenu] = useState<PendingMenu | null>(null)

  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail: any = (e as CustomEvent).detail
      setMenu({ id: detail.id, rect: detail.rect ?? null })
    }
    window.addEventListener('open-appointment-menu', onOpen as EventListener)

    // Close when clicking outside the menu (use mousedown so it runs before click handlers)
    const onDown = (ev: MouseEvent) => {
      if (!menuRef.current) return
      const target = ev.target as Node | null
      if (target && !menuRef.current.contains(target)) {
        setMenu(null)
      }
    }

    const onScroll = () => setMenu(null)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('open-appointment-menu', onOpen as EventListener)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (!menu) return null
  if (typeof document === 'undefined') return null

  const menuWidth = 240
  const left = menu.rect ? Math.min(Math.max(menu.rect.right - menuWidth, 8), window.innerWidth - menuWidth - 8) : 16
  const top = menu.rect ? menu.rect.bottom + 8 : 64

  const node = (
    <div ref={menuRef} style={{ position: 'fixed', top, left, zIndex: 9999, width: menuWidth }} className="bg-popover text-popover-foreground rounded-md border shadow-md p-2">
      <div className="text-sm font-medium px-2 py-1">Appointment</div>
      <div className="divide-y">
        <div className="px-2 py-2">
          <button className="w-full text-left">View Details</button>
        </div>
        <div className="px-2 py-2">
          <button className="w-full text-left">Confirm</button>
        </div>
        <div className="px-2 py-2">
          <button className="w-full text-left">Mark Completed</button>
        </div>
        <div className="px-2 py-2">
          <button className="w-full text-left text-destructive">Cancel</button>
        </div>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
