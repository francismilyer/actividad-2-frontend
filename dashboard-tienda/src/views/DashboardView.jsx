import { useState, useEffect } from 'react';
import { HiCollection, HiShoppingBag, HiCurrencyDollar } from 'react-icons/hi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell // gráfico tort
} from 'recharts';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';

export default function DashboardView() {
  const [stats, setStats] = useState({ totalRelojes: 0, totalVentas: 0, ingresosTotales: 0 });
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]); // state gráfico de marcas
  const [recentSales, setRecentSales] = useState([]);   // state ventas recientes
  const [loading, setLoading] = useState(true);

  
  const PIE_COLORS = ['#0D47A1', '#2196F3', '#64B5F6', '#90CAF9', '#1565C0', '#1976D2'];

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
        
        // grafico barras
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const dataMensual = meses.map(mes => ({ name: mes, ingresos: 0 }));
        
        // grafico torta
        const marcasMap = {};

        ventasData.forEach(venta => {
          // Procesar meses
          const mesString = venta.fecha.split('T')[0].split('-')[1];
          const monthIndex = parseInt(mesString, 10) - 1; 
          if (monthIndex >= 0 && monthIndex <= 11) {
            dataMensual[monthIndex].ingresos += Number(venta.precio_final);
          }

          // Procesar marcas
          if (marcasMap[venta.marca]) {
            marcasMap[venta.marca] += Number(venta.precio_final);
          } else {
            marcasMap[venta.marca] = Number(venta.precio_final);
          }
        });

        // Convertir marcas a un arreglo para Recharts
        const dataMarcas = Object.keys(marcasMap).map(key => ({
          name: key,
          value: marcasMap[key]
        }));
        
        setBarChartData(dataMensual);
        setPieChartData(dataMarcas);

        // ultimas 5 ventas
        setRecentSales(ventasData.slice(0, 5));
        
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

      {/* grid  tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Modelos en Catálogo" value={stats.totalRelojes} icon={HiCollection} />
        <StatCard title="Ventas (Ene - Oct 2026)" value={stats.totalVentas} icon={HiShoppingBag} />
        <StatCard title="Ingresos Totales" value={stats.ingresosTotales} icon={HiCurrencyDollar} isCurrency={true} />
      </div>

      {/* grafico de barras*/}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-[#0D47A1] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Análisis de Ingresos Mensuales (2026)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString('en-US')}`, 'Ingresos']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="ingresos" name="Ingresos (USD)" fill="#2196F3" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* grafico torta*/}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-[#0D47A1] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ingresos por Marca
          </h3>
          <div className="h-64 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString('en-US')}`, 'Ingresos']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/*ultimas ventas */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#0D47A1] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Actividad Reciente
          </h3>
          <div className="flex flex-col space-y-4">
            {recentSales.map((venta) => (
              <div key={venta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:bg-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{venta.cliente}</p>
                  <p className="text-sm text-gray-500">{venta.marca} {venta.modelo}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2196F3]">${Number(venta.precio_final).toLocaleString('en-US')}</p>
                  <p className="text-xs text-gray-400">{new Date(venta.fecha).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay ventas recientes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}