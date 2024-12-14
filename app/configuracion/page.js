"use client";

import { supabase } from "@/supabase/supabaseClient";
import { useState } from "react";

export default function Configuracion() {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    ruc: "",
    logo: "", 
  });

  const escucharCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const escucharCambioFile = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const crearEmpresa = async (e) => {
    e.preventDefault();
    try {
      let logoUrl = null;
      if (formData.logo) {
        const { data, error } = await supabase.storage
          .from("logoEmpresa")
          .upload(`empresas/${Date.now()}_${formData.logo.name}`, formData.logo);
        
        if (error) throw new Error("Error subiendo el logo: " + error.message);
        
        const { data: { publicUrl } } = supabase.storage
          .from("logoEmpresa")
          .getPublicUrl(data.path);
        
        logoUrl = publicUrl;
      }
      
      const response = await fetch("/api/datoempresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, logo: logoUrl }),
      });
      
      if (!response.ok) throw new Error("Error al crear la empresa");
      
      alert("Empresa creada con éxito");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  
  return (
    <div>
      <form onSubmit={crearEmpresa} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={escucharCambio}
          className="border p-2"
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={escucharCambio}
          className="border p-2"
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={escucharCambio}
          className="border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={escucharCambio}
          className="border p-2"
        />
        <input
          type="text"
          name="ruc"
          placeholder="RUC"
          value={formData.ruc}
          onChange={escucharCambio}
          maxLength={11}
          className="border p-2"
        />
        <input
          type="file"
          name="logo"
          onChange={escucharCambioFile}
          accept="image/*"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Crear Empresa
        </button>
      </form>
    </div>
  );
}
