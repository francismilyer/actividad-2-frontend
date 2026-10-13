import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import PageHeader from '../components/PageHeader'; // componente reutilizable

export default function VentasView() {
  // states para almacenar las 3 listas de datos necesarias
  const [ventas, setVentas] = useState([]);
  const [relojes, setRelojes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // states para el formulario modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    reloj_id: '', cliente_id: '', fecha: '', precio_final: ''
  });

  // cargar ventas, Relojes y Clientes 
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // peticiones al backend 
      const [ventasRes, relojesRes, clientesRes] = await Promise.all([
        fetch('http://localhost:3000/api/ventas'),
        fetch('http://localhost:3000/api/relojes'),
        fetch('http://localhost:3000/api/clientes')
      ]);

      setVentas(await ventasRes.json());
      setRelojes(await relojesRes.json());
      setClientes(await clientesRes.json());
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // autocompletar el precio sugerido para el reloj
  const handleRelojChange = (e) => {
    const selectedRelojId = e.target.value;
    const relojSeleccionado = relojes.find(r => r.id === parseInt(selectedRelojId));
    
    setFormData({ 
      ...formData, 
      reloj_id: selectedRelojId,
      precio_final: relojSeleccionado ? relojSeleccionado.precio : ''
    });
  };

  const handleOpenCreate = () => {
    // fecha actual por defecto en el formulario
    const hoy = new Date('2026-10-14').toISOString().split('T')[0]; 
    setFormData({ reloj_id: '', cliente_id: '', fecha: hoy, precio_final: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        reloj_id: parseInt(formData.reloj_id),
        cliente_id: parseInt(formData.cliente_id),
        fecha: formData.fecha,
        precio_final: parseFloat(formData.precio_final)
      };

      const response = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error("Error al registrar la venta");
      
      setShowModal(false);
      fetchData(); 
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo registrar la venta.");
    }
  };

  if (loading) return <div className="p-6">Cargando historial de ventas...</div>;

  return (
    <div className="w-full h-full bg-white p-6 relative">
      
      {/* componente reutilizable con props */}
      <PageHeader 
        title="Registro de Ventas" 
        buttonText="Registrar Venta" 
        onButtonClick={handleOpenCreate} 
      />

      {/* Historial de Ventas */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">ID Venta</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Reloj (Marca y Modelo)</th>
              <th className="px-6 py-4">Precio Pagado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">V-{venta.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-4">{new Date(venta.fecha).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium text-[#0D47A1]">{venta.cliente}</td>
                <td className="px-6 py-4">{venta.marca} {venta.modelo}</td>
                <td className="px-6 py-4 font-bold text-green-600">
                  ${Number(venta.precio_final).toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registrar Nueva Venta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-[#0D47A1]">Registrar Nueva Venta</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Cliente</label>
                <select required name="cliente_id" value={formData.cliente_id} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]">
                  <option value="">-- Elige un cliente --</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Reloj</label>
                <select required name="reloj_id" value={formData.reloj_id} onChange={handleRelojChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]">
                  <option value="">-- Elige un reloj --</option>
                  {relojes.map(r => (
                    <option key={r.id} value={r.id}>{r.marca} {r.modelo} (${r.precio})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Venta</label>
                  <input required type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Final (USD)</label>
                  <input required type="number" step="0.01" name="precio_final" value={formData.precio_final} onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3]" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-[#0D47A1] rounded-lg hover:bg-blue-800 font-medium">
                  Procesar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}