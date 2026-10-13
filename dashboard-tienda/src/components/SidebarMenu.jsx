import { HiChartPie, HiShoppingBag, HiUsers, HiCollection } from 'react-icons/hi';

export default function SidebarMenu({ activeView, setActiveView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiChartPie },
    { id: 'relojes', label: 'Catálogo de Relojes', icon: HiCollection },
    { id: 'clientes', label: 'Clientes', icon: HiUsers },
    { id: 'ventas', label: 'Ventas', icon: HiShoppingBag },
  ];

  return (
    <div className="h-screen w-64 bg-[#091540] border-r border-[#091540] flex flex-col">
      {/* titulo y logo */}
      <div className="px-6 py-8">
        <h2 
          className="text-white text-2xl font-bold" 
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          ChronoReact
        </h2>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon; 
          const isActive = activeView === item.id; 
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-left group
                ${isActive 
                  ? "bg-[#2196F3] text-white shadow-md" // Botón ACTIVO: Fondo azul claro, texto blanco
                  : "text-gray-300 hover:bg-[#0D47A1] hover:text-white" // Botones INACTIVOS: Texto gris claro, al pasar el ratón fondo azul oscuro y texto blanco
                }
              `}
            >
              
              {Icon && (
                <Icon 
                  className={`w-6 h-6 mr-3 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`} 
                />
              )}
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}