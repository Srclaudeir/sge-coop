import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  CreditCard,
  Building,
  Users,
  FileText,
  File,
  Menu,
  ChevronLeft,
} from "lucide-react";

const Sidebar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "machines", label: "Máquinas", icon: CreditCard, path: "/machines" },
    { id: "agencies", label: "Agências", icon: Building, path: "/agencies" },
    { id: "clients", label: "Clientes", icon: Users, path: "/clients" },
    {
      id: "operations",
      label: "Operações",
      icon: FileText,
      path: "/operations",
    },
    { id: "reports", label: "Relatórios", icon: File, path: "/reports" },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white ${
        isSidebarOpen ? "w-64" : "w-16"
      } fixed h-full transition-all duration-300 z-10`}
    >
      <div className="p-4 flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-400" />
            <span className="ml-2 font-bold text-xl">Sicoob POS</span>
          </div>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <nav className="mt-5 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } ${!isSidebarOpen && "justify-center"}`
            }
          >
            <item.icon className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center px-4 py-2">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="font-bold">{user?.name.charAt(0)}</span>
              </div>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">
                  {user?.role === "super_admin"
                    ? "Administrador"
                    : "Gestor de Agência"}
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
