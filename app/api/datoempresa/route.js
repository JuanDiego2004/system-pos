import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const data = await request.json();

        // Validar RUC
    if (!/^\d{11}$/.test(data.ruc)) {
        return new Response("El RUC debe tener exactamente 11 dígitos numéricos", { status: 400 });
      }
        const datosEmpresa = await prisma.empresa.create({
            data: {
                nombre: data.nombre,
                direccion: data.direccion,
                telefono: data.telefono,
                email: data.email,
                ruc: data.ruc,
                logo: data.logo
            }
        });
        return new Response(JSON.stringify(datosEmpresa), { status: 201});
    } catch (error) {
        console.error("Error al crear empresa: ", error);
        return new Response("Error creando empresa:", { status: 500});
    }
}

export async function GET() {
    try {
        const empresa = await prisma.empresa.findFirst();

        if (!empresa) {
            return new Response("No se encontro la empresa", { status: 404});
        }
        return new Response(JSON.stringify(empresa), { status: 200});
    } catch (error) {
        console.error("Error al obtener los datos de la empresa: ", error);
        return new Response("Error obteniendo los datos de la empresa", { status: 500 }); 
    }
}