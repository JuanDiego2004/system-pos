"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/supabase/supabaseClient";
import LogoutButton from './components/botones/logoutBoton';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Solo redirige si no hay sesión y no estás en la página de registro
      if (!session && router.pathname !== '/registro') {
        router.push('/registro');
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session && router.pathname !== '/') {
        router.push('/');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Bienvenido, {user.email}</h1>
      <LogoutButton />
    </div>
  );
}
