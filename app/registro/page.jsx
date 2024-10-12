"use client";

import { useState } from 'react';
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from 'next/navigation';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault(); 
    console.log("Registro en progreso..."); 

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Asegúrate de enviar la contraseña también si es necesario
      });

      console.log('Respuesta del servidor:', res);

    const data = await res.json();

    console.log('Datos del servidor:', data);

      if (res.ok) {
setMessage("Perfil creado exitosamente.");
        router.push('/'); 
      } else {
        // Si hay un error, muestra el mensaje de error
        setError(data.error || "Error en el registro.");
      }

      console.log('Perfil creado:', data);
      // Muestra un mensaje de éxito si es necesario
      setMessage("Perfil creado exitosamente.");
    } catch (error) {
      console.error('Error:', error.message);
      setError("Error en el servidor.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-cyan-600 h-screen w-full flex flex-col items-center justify-center">
      <div className="h-3/4 w-2/5 bg-white rounded-3xl shadow-lg">
        <div className="p-4">
          <h1 className="text-center text-2xl font-bold mb-4">Registro</h1>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700">Correo electrónico: </label>
              <input
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700">Contraseña: </label>
              <input
                id="password"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-gray-700">Confirmar Contraseña: </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
  
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
            >
              Registrarse
            </button>
          </form>
          
          <p className="text-center mt-4">
            ¿Ya tienes una cuenta? <a href="/login" className="text-blue-500 underline">Inicia sesión aquí</a>.
          </p>
        </div>
      </div>
    </div>
  );
  
}
