// src/components/StatCard.jsx
export default function StatCard({ title, value, icon: Icon, isCurrency = false }) {
  // Formateamos el valor si es moneda (isCurrency = true)
  const displayValue = isCurrency ? `$${Number(value).toLocaleString('en-US')}` : value;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center space-x-4 transition-transform hover:scale-105">
      <div className="p-4 bg-[#90CAF9] text-[#0D47A1] rounded-lg">
        {/* Renderizamos el icono que pasemos por props */}
        {Icon && <Icon className="w-8 h-8" />}
      </div>
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-[#0D47A1]">
          {displayValue}
        </h3>
      </div>
    </div>
  );
}