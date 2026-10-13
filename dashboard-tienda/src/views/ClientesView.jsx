import { useState, useEffect } from 'react';
import { HiPencilAlt, HiTrash, HiX } from 'react-icons/hi';
import PageHeader from '../components/PageHeader'; // Uso de componente reutilizable obligatorio

export default function ClientesView() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal y Formulario
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', correo: '', telefono: '' });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clientes');
      const data = await response.json();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ nombre: '', correo: '', telefono: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cliente) => {
    setEditingId(cliente.id);
    setFormData({ nombre: cliente.nombre, correo: cliente.correo, telefono: cliente.telefono });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/clientes/${editingId}` : 'http://localhost:3000/api/clientes';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error}`);
        return;
      }
      setShowModal(false);
      fetchClientes();
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente? (Nota: No se puede eliminar si tiene ventas registradas)')) {
      try {
        const response = await fetch(`http://localhost:3000/api/clientes/${id}`, { method: 'DELETE' });
        if (!response.ok) {
           alert('❌ No se puede eliminar: El cliente ya tiene compras registradas en el sistema.');
           return;
        }
        fetchClientes();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (loading) return <div className="p-6">Cargando clientes...</div>;

  return (
    <div className="w-full h-full bg-white p-6 relative">
      
      {/* Componente Reutilizable pasado por Props */}
      <PageHeader 
        title="Gestión de Clientes" 
        buttonText="Nuevo Cliente" 
        onButtonClick={handleOpenCreate} 
      />

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nombre Completo</th>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">#{cliente.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{cliente.nombre}</td>
                <td className="px-6 py-4">{cliente.correo}</td>
                <td className="px-6 py-4">{cliente.telefono}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => handleOpenEdit(cliente)} className="text-[#2196F3] hover:text-[#0D47A1] transition-colors" title="Editar">
                      <HiPencilAlt className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(cliente.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-[#0D47A1]">
                {editingId ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" name="correo" value={formData.correo} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="ejemplo@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input required type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="+1234567890" />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-[#0D47A1] rounded-lg hover:bg-blue-800 font-medium">
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}