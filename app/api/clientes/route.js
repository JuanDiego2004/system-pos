//imprtamos NextResponse para mejorar las respuestas HTTP y prisma para interactuar con la base ded atos
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import React from "react";


// esta funcion maneja las distintas solicitudes http que lmegan al endpoint
export async function handler(solicitud) {
  //obtebnemos el metodo http de la solicutud (POST, GET, PUT, DELETE)
   const metodo = solicitud.metodo;
  //utilizamos un switch para determionar que funcion ejecutar segun el metodo
  switch (metodo) {
    case "POST":
      return await crearCliente(solicitud);
    case "GET":
      return await obtenerClientes(solicitud);
    case "PUT":
      return await editarCliente(solicitud);
    case "DELETE":
      return await eliminarCliente(solicitud);
    default:
      return NextResponse.json({message: "Metodo jno permitido"} , {status: 405});
  } 
}

async function crearCliente(solicitud) {
  try {
    // Obtenemos el cuerpo de la solicitud en formato JSON
    const body = await solicitud.json();
    console.log("DATOS RECIBIDOS", body);
    //Extraemos los campos necesarios de la solicitud
    const { tipoDocumento, codigoCliente, lugar, direccion, numeroDocumento, nombre} = body;
    //validacion de campos requeridos
    if(!tipoDocumento || !codigoCliente || !lugar || !direccion || !numeroDocumento || !nombre ) {
      return NextResponse.json({message: "Todos los cmapos son requeridps"}, {status: 400})
    }

    //creamos el cliente en la base de datos
    const cliente = await prisma.cliente.create({
      data: {
        tipoDocumento,
        codigoCliente,
        lugar,
        direccion,
        numeroDocumento,
        nombre
      }
    });
    console.log("Cliente generado en prisma", cliente);
    return NextResponse.json(cliente, {status: 201}); // Retornamos el cliente creado con un código de estado 201 (Creado)
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    // Manejo de errores específico para código de error de unicidad
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'El código de cliente o número de documento ya existe' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error al crear el cliente', error: error.message }, { status: 400 });
  }
  }


async function obtenerClientes(solicitud) {
  try {
    //usamos prisma para encontrar para encontrarcleintes en db
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes, {status: 200});
  } catch (error) {
    console.error("Erro al ontener datos", error);
    return NextResponse.json({message: "Error al obtener clientes", error: error.message})
  }
}

async function editarCliente(solicitud) {
  try {
    //otenemos el cuerpo de la solicitud en formato json
    const body = await solicitud.json();
    console.log("Datos reciobidos para ditar cliente", body);
    // Extraemos los campos necesarios del cuerpo de la solicitud
    const { id, tipoDocumento, codigoCliente, lugar, direccion, numeroDocumento, nombre } = body;
    // Validación de campos requeridos
    if (!id || !tipoDocumento || !codigoCliente || !lugar || !direccion || !numeroDocumento || !nombre) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }
        // Editamos el cliente en la base de datos usando Prisma
        const cliente = await prisma.cliente.update({
          where: { id }, // Buscamos el cliente por su ID
          data: {
            tipoDocumento,
            codigoCliente,
            lugar,
            direccion,
            numeroDocumento,
            nombre
          },
        });
    
        console.log('Cliente editado en Prisma:', cliente);
        return NextResponse.json(cliente, { status: 200 }); // Retornamos el cliente editado con un código de estado 200 (OK)
     
  } catch (error) {
    console.error('Error al editar el cliente:', error);
    return NextResponse.json({ message: 'Error al editar el cliente', error: error.message }, { status: 400 });
 
  }
}


// Función para eliminar un cliente existente
async function eliminarCliente(solicitud) {
  try {
    // Obtenemos el ID del cliente a eliminar en formato JSON
    const { id } = await solicitud.json();
    console.log('ID recibido para eliminar cliente:', id);

    // Validación del ID
    if (!id) {
      return NextResponse.json({ message: 'El ID es requerido' }, { status: 400 });
    }

    // Eliminamos el cliente de la base de datos usando Prisma
    await prisma.cliente.delete({
      where: { id }, // Buscamos el cliente por su ID
    });

    console.log('Cliente eliminado de Prisma:', id);
    return NextResponse.json({ message: 'Cliente eliminado correctamente' }, { status: 204 }); // Retornamos un mensaje de éxito con un código de estado 204 (Sin contenido)
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    return NextResponse.json({ message: 'Error al eliminar el cliente', error: error.message }, { status: 400 });
  }
}


// Función para manejar las solicitudes POST
export async function POST(solicitud) {
  return await crearCliente(solicitud);
}

// Función para manejar las solicitudes GET
export async function GET(solicitud) {
  return await obtenerClientes(solicitud);
}

// Función para manejar las solicitudes PUT
export async function PUT(solicitud) {
  return await editarCliente(solicitud);
}

// Función para manejar las solicitudes DELETE
export async function DELETE(solicitud) {
  return await eliminarCliente(solicitud);
}
