import { useState } from 'react';
import { Toaster } from 'react-hot-toast'; 
import SidebarMenu from './components/SidebarMenu';
import DashboardView from './views/DashboardView';
import RelojesView from './views/RelojesView';
import ClientesView from './views/ClientesView';
import VentasView from './views/VentasView';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

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
      {/* Notificaciones globales */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
          },
          success: { style: { background: '#0D47A1' } },
          error: { style: { background: '#ef4444' } },
        }}
      />

      <SidebarMenu activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        {renderView()}
      </main>
    </div>
  );
}

export default App;