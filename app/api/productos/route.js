import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try{
   const productos = await prisma.producto.findMany();
   return new Response(JSON.stringify(productos), {status: 200});
  } catch (error){
  return new Response(JSON.stringify({error: "Error al obntener datos"}), { status: 500});
  
  }
}
