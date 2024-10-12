// components/LogoutButton.js
import {supabase} from "@/supabase/supabaseClient";
import { useRouter } from 'next/router'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  )
}
