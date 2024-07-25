import Link from "next/link";
import '@fontsource-variable/roboto-condensed';
import '@fontsource/fira-sans';
import { TiHomeOutline } from "react-icons/ti";

const MenuITems = [
    {name: "Inicio", path: "/", icon: <TiHomeOutline />},
    {name: "Productos", path: "/productos", icon: <span className="icon-[mynaui--home]"></span>},
    {name: "Inventario", path: "/inventario", icon: <span className="icon-[mynaui--home]"></span>},
    {name: "Ventas", path: "/ventas", icon: <span className="icon-[mynaui--grid-one]"></span>},
    
]


const Sidebar = () => {

    return (
      <div className="h-screen w-45 bg-white text-black flex flex-col  ">
       <div className="p-4 text-2xl font-bold">System POS</div>
       <nav className="mt-4 flex-1">
        <ul>
            {MenuITems.map((item, index) => (
                <li key={index} className="px-4 py-2 hover:bg-blue-600 hover:rounded-lg fira-sans">
                 <Link href={item.path} className="h-7 font-bold flex items-center space-x-2 hover:text-white ">
                    {item.icon}
                    <span>{item.name}</span>
                 </Link>
                </li>
            ))}
        </ul>
       </nav>
      </div>
    )
}

export default Sidebar;
