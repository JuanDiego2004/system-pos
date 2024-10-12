// components/ProtectedRoute.js
"use client";
import { useEffect, useState } from 'react'
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from 'next/router'

export default function ProteccionRutas({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = supabase.auth.getSession()
    if (session?.data?.session) {
      setAuthenticated(true)
    } else {
      router.push('/login')
    }
    setLoading(false)

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
        router.push('/login')
      }
      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) return <p>Cargando...</p>

  return authenticated ? children : null
}
