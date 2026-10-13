import { useState, useEffect } from 'react';
import { HiCollection, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';

export default function DashboardView() {
  const [stats, setStats] = useState({ totalRelojes: 0, totalVentas: 0, ingresosTotales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard');
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-xl font-bold text-[#2196F3] text-center mt-20">Cargando métricas...</div>;
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Uso de nuestro componente reutilizable para el título */}
      <PageHeader title="Dashboard (Resumen)" />

      {/* Grid de Tarjetas usando Componentización obligatoria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Modelos en Catálogo" 
          value={stats.totalRelojes} 
          icon={HiCollection} 
        />
        <StatCard 
          title="Ventas (Ene - Oct 2026)" 
          value={stats.totalVentas} 
          icon={HiShoppingBag} 
        />
        <StatCard 
          title="Ingresos Totales" 
          value={stats.ingresosTotales} 
          icon={HiCurrencyDollar} 
          isCurrency={true} 
        />
      </div>
    </div>
  );
}