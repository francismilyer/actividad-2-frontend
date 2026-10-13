import { useState, useEffect } from 'react';
import { HiPencilAlt, HiTrash, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast'; // <--- NUEVA IMPORTACIÓN
import PageHeader from '../components/PageHeader';

export default function RelojesView() {
  const [relojes, setRelojes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados obligatorios para el formulario (Crear/Editar)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Modo Crear, ID = Modo Editar
  const [formData, setFormData] = useState({
    marca: '', modelo: '', anio: '', precio: '', foto: ''
  });

  // useEffect OBLIGATORIO para cargar los datos al inicio
  useEffect(() => {
    fetchRelojes();
  }, []);

  const fetchRelojes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/relojes');
      const data = await response.json();
      setRelojes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar relojes:", error);
      setLoading(false);
    }
  };

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Abrir modal para Crear
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ marca: '', modelo: '', anio: '', precio: '', foto: '' });
    setShowModal(true);
  };

  // Abrir modal para Editar
  const handleOpenEdit = (reloj) => {
    setEditingId(reloj.id);
    setFormData({
      marca: reloj.marca, modelo: reloj.modelo, anio: reloj.anio, 
      precio: reloj.precio, foto: reloj.foto
    });
    setShowModal(true);
  };

  // Enviar el formulario 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/relojes/${editingId}` : 'http://localhost:3000/api/relojes';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const payload = {
        marca: formData.marca,
        modelo: formData.modelo,
        anio: parseInt(formData.anio),
        precio: parseFloat(formData.precio),
        foto: formData.foto
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`); // <--- Toast de error
        return;
      }

      setShowModal(false); 
      fetchRelojes(); 
      toast.success(editingId ? 'Reloj actualizado con éxito' : 'Reloj agregado al catálogo'); // <--- Toast de éxito     
    } catch (error) {
      console.error("Error de conexión:", error);
      toast.error("No se pudo conectar con el servidor.");
    }
  };

  // Eliminar un reloj (
  const handleDelete = async (id) => {
    // En eliminaciones críticas, mantenemos el confirm nativo por seguridad
    if (window.confirm('¿Estás seguro de que deseas eliminar este reloj?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/relojes/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            toast.error('No se puede eliminar: El reloj ya tiene ventas registradas.');
            return;
        }

        fetchRelojes(); 
        toast.success('Reloj eliminado correctamente'); // <--- Toast de éxito
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al intentar eliminar el reloj.");
      }
    }
  };

  if (loading) return <div className="p-6">Cargando catálogo...</div>;

  return (
    <div className="w-full h-full bg-white p-6 relative">
      <PageHeader title="Catálogo de Relojes" buttonText="Nuevo Reloj" onButtonClick={handleOpenCreate} />

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Marca</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4">Año</th>
              <th className="px-6 py-4">Precio (USD)</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {relojes.map((reloj) => (
              <tr key={reloj.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img src={reloj.foto} alt={reloj.modelo} className="w-16 h-16 object-cover rounded-md border border-gray-200"/>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{reloj.marca}</td>
                <td className="px-6 py-4">{reloj.modelo}</td>
                <td className="px-6 py-4">{reloj.anio}</td>
                <td className="px-6 py-4 font-medium text-gray-900">${Number(reloj.precio).toLocaleString('en-US')}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => handleOpenEdit(reloj)} className="text-[#2196F3] hover:text-[#0D47A1] transition-colors" title="Editar">
                      <HiPencilAlt className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(reloj.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Eliminar">
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (Formulario de Creación / Edición) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-[#0D47A1]">
                {editingId ? 'Editar Reloj' : 'Agregar Nuevo Reloj'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input required type="text" name="marca" value={formData.marca} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="Ej. Rolex" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input required type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="Ej. Submariner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <input required type="number" name="anio" value={formData.anio} onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD)</label>
                  <input required type="number" step="0.01" name="precio" value={formData.precio} onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="5000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Foto</label>
                <input required type="text" name="foto" value={formData.foto} onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#2196F3] focus:border-[#2196F3]" placeholder="https://..." />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-[#0D47A1] rounded-lg hover:bg-blue-800 font-medium">
                  Guardar Reloj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}