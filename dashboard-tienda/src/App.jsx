import { useState } from 'react';
import SidebarMenu from './components/SidebarMenu';
import DashboardView from './views/DashboardView';
import RelojesView from './views/RelojesView';
import ClientesView from './views/ClientesView';
import VentasView from './views/VentasView';

function App() {
  // Estado para controlar qué vista se muestra actualmente
  const [activeView, setActiveView] = useState('dashboard');

  // Función que renderiza la vista correspondiente
  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'relojes': return <RelojesView />;
      case 'clientes': return <ClientesView />;
      case 'ventas': return <VentasView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-white w-full overflow-hidden">
      {/* El Sidebar recibe el estado y la función para actualizarlo (Props) */}
       <SidebarMenu activeView={activeView} setActiveView={setActiveView} />
      
      {/* Área principal donde se carga el contenido de la vista seleccionada */}
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        {renderView()}
      </main>
    </div>
  );
}

export default App;