"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import '@fontsource-variable/roboto-condensed';
import '@fontsource/fira-sans';
import { TiHomeOutline } from "react-icons/ti";
import { FaBox, FaWarehouse, FaCashRegister,FaChevronDown, FaChevronUp } from "react-icons/fa";



const MenuItems = [
    { name: "Inicio", path: "/", icon: TiHomeOutline },
    { 
        name: "Ventas",
        path: "/ventas",
        icon: FaBox,
        submenu: [
            { name: "Nueva Venta", path: "/ventas/nueva-venta" },
            { name: "Historial", path: "/ventas/historial-venta" },
            { name: "Factura e Emision", path: "/ventas/factura" },
            { name: "Devoluciones y anulaciones", path: "/ventas/devoluciones" },
        ] 
    },
    { name: "Inventario", path: "/productos", icon: FaWarehouse },
    {
         name: "Clientes", 
         path: "/clientes", 
         icon: FaCashRegister,
         submenu: [
            { name: "Registro", path: "/clientes/registro" },
            { name: "Historial Compras", path: "/clientes/historial" },
            { name: "Programas de Fidelidad", path: "/clientes/fidelidad" },
            { name: "Cunetas por cobrar", path: "/clientes/cuentas" },
         ]
    },
    {
        name: "Proveedores", 
        path: "/proveedores", 
        icon: FaCashRegister,
        submenu: [
           { name: "Registro", path: "/proveedores/registro" },
           { name: "Historial Compras", path: "/proveedores/historial" },
           { name: "Ordenes de compras", path: "/clientes/compras" },
           { name: "Cunetas por cobrar", path: "/clientes/cuentas" },
        ]
    },
    {
        name: "Reportes", 
        path: "/reportes", 
        icon: FaCashRegister,
        submenu: [
           { name: "Ventas por periodo", path: "/proveedores/registro" },
           { name: "Mas vendidos", path: "/proveedores/historial" },
           { name: "Iventario", path: "/clientes/compras" },
           { name: "Rentabilidad", path: "/clientes/cuentas" },
        ]
    },
    { name: "Configuracion", path: "/", icon: TiHomeOutline },
    { name: "Cierre de caja", path: "/", icon: TiHomeOutline }, 
];

const Sidebar = () => {
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState(null);
    const logo = "https://acxbeymnpkkexnplcwjf.supabase.co/storage/v1/object/sign/productos/coca.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0b3MvY29jYS5qcGciLCJpYXQiOjE3MjMzMjkzODgsImV4cCI6MTc1NDg2NTM4OH0.68gIXFgZ0nIVz1__EmdSMwUi_3grgGGEnxpOSLDivxs&t=2024-08-10T22%3A36%3A28.123Z";

    const handleToggleMenu = (index) => {
        setOpenMenu(openMenu === index ? null : index);
    };

    return (
        <div className="relative h-screen w-16 bg-white text-black flex flex-col border-r-4 border-gray-300 overflow-hidden transition-all duration-300 ease-in-out hover:w-52 group z-50">
            {/* header */}
            <div className="p-4 flex items-center justify-between">
                <img src={logo} className="w-12" alt="Logo" />
                <div className="w-2.5"></div>
                <div className="flex flex-col justify-center items-center ml-4 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                    <h2 className="text-sm font-bold">INVERSIONES RISTOS E.I.RL</h2>
                    <p className="text-xs">La lealtad tiene su recompensa</p>
                </div>
            </div>
            {/* divider */}
            <div className="border-t border-gray-300 my-2"></div>
            <nav className="mt-4 flex-1 w-full">
                <div className="w-11/12 mx-auto">
                    <ul>
                        {MenuItems.map((item, index) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;
                            const isMenuOpen = openMenu === index;

                            return (
                                <li key={index}>
                                    <div
                                        className={`px-4 py-2 hover:bg-green-300 hover:rounded-lg fira-sans flex items-center justify-between ${
                                            isActive ? 'bg-green-500 rounded-lg' : ''
                                        }`}
                                    >
                                        <Link
                                            href={item.path}
                                            className={`h-6 font-bold flex items-center space-x-2 ${
                                                isActive ? 'text-white' : ''
                                            }`}
                                        >
                                            <Icon className="text-xl" />
                                            <span className="ml-2 text-xs group-hover:inline-block hidden transition-opacity duration-300 ease-in-out">
                                                {item.name}
                                            </span>
                                        </Link>
                                        {item.submenu && (
                                            <button
                                                onClick={() => handleToggleMenu(index)}
                                                className="text-xs focus:outline-none"
                                            >
                                                {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        )}
                                    </div>
                                    {isMenuOpen && item.submenu && (
                                        <ul className="ml-6 mt-2">
                                            {item.submenu.map((subitem, subindex) => (
                                                <li key={subindex} className="px-4 py-1 hover:bg-green-200 hover:rounded-lg">
                                                    <Link
                                                        href={subitem.path}
                                                        className="text-xs block"
                                                    >
                                                        {subitem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
