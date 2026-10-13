import { useState, useEffect } from 'react';
import { HiCollection, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';

export default function DashboardView() {
  const [stats, setStats] = useState({ totalRelojes: 0, totalVentas: 0, ingresosTotales: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ventasRes] = await Promise.all([
          fetch('http://localhost:3000/api/dashboard'),
          fetch('http://localhost:3000/api/ventas')
        ]);
        
        const statsData = await statsRes.json();
        const ventasData = await ventasRes.json();
        
        setStats(statsData);
        
        // --- Procesamiento de Datos para el Gráfico ---
        // AHORA INCLUYE TODOS LOS MESES DEL AÑO (Agregados Nov y Dic)
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const dataProcesada = meses.map(mes => ({ name: mes, ingresos: 0 }));
        
        // Agrupamos y sumamos los ingresos de las 40 ventas simuladas según su mes
        ventasData.forEach(venta => {
          const mesString = venta.fecha.split('T')[0].split('-')[1];
          const monthIndex = parseInt(mesString, 10) - 1; 
          
          // Ahora aceptamos desde el índice 0 (Ene) hasta el 11 (Dic)
          if (monthIndex >= 0 && monthIndex <= 11) {
            dataProcesada[monthIndex].ingresos += Number(venta.precio_final);
          }
        });
        
        setChartData(dataProcesada);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-xl font-bold text-[#2196F3] text-center mt-20">Cargando métricas y gráficos...</div>;
  }

  return (
    <div className="w-full h-full bg-white p-6 relative">
      <PageHeader title="Dashboard (Resumen)" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Modelos en Catálogo" value={stats.totalRelojes} icon={HiCollection} />
        <StatCard title="Ventas (Ene - Oct 2026)" value={stats.totalVentas} icon={HiShoppingBag} />
        <StatCard title="Ingresos Totales" value={stats.ingresosTotales} icon={HiCurrencyDollar} isCurrency={true} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Título actualizado */}
        <h3 className="text-xl font-bold text-[#0D47A1] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Análisis de Ingresos (Año 2026)
        </h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis 
                stroke="#6b7280" 
                tickFormatter={(value) => `$${value / 1000}k`} 
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString('en-US')}`, 'Ingresos']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar 
                dataKey="ingresos" 
                name="Ingresos (USD)" 
                fill="#2196F3" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}