import { useState, useEffect } from 'react';
import { HiCollection, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';

export default function DashboardView() {
  // Guardamos los datos que vienen del backend
  const [stats, setStats] = useState({
    totalRelojes: 0,
    totalVentas: 0,
    ingresosTotales: 0
  });
  
  // saber si la información está cargando
  const [loading, setLoading] = useState(true);

  // Consultar la API cuando el componente se muestra en pantalla
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard');
        const data = await response.json();
        
        // Actualizamos el estado con los datos reales de MariaDB
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // se ejecuta solo 1 vez al cargar la vista

  // mensaje de carga
  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex justify-center items-center">
        <h2 className="text-xl font-bold text-[#2196F3]">Cargando métricas...</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      <h1 className="text-3xl font-bold text-[#0D47A1] mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Dashboard
      </h1>

      {/* Grid de Tarjetas con Tailwind CSS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Total de Relojes */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-[#90CAF9] text-[#0D47A1] rounded-lg">
            <HiCollection className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Modelos en Catálogo</p>
            <h3 className="text-3xl font-bold text-[#0D47A1]">
              {stats.totalRelojes}
            </h3>
          </div>
        </div>

        {/* Tarjeta 2: Total de Ventas */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-[#90CAF9] text-[#0D47A1] rounded-lg">
            <HiShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Ventas (Ene - Oct 2026)</p>
            <h3 className="text-3xl font-bold text-[#0D47A1]">
              {stats.totalVentas}
            </h3>
          </div>
        </div>

        {/* Tarjeta 3: Ingresos Totales */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-[#90CAF9] text-[#0D47A1] rounded-lg">
            <HiCurrencyDollar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Ingresos Totales</p>
            <h3 className="text-3xl font-bold text-[#0D47A1]">
             
              ${Number(stats.ingresosTotales).toLocaleString('en-US')}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}