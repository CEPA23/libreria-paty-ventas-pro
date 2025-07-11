
import { useState } from 'react';
import { StoreProvider } from '@/contexts/StoreContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { ProductosList } from '@/components/Productos/ProductosList';
import { CategoriasList } from '@/components/Categorias/CategoriasList';
import { VentaCarrito } from '@/components/Ventas/VentaCarrito';
import { ClientesList } from '@/components/Clientes/ClientesList';
import { Reportes } from '@/components/Reportes/Reportes';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <ProductosList />;
      case 'categorias':
        return <CategoriasList />;
      case 'ventas':
        return <VentaCarrito />;
      case 'clientes':
        return <ClientesList />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <StoreProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
          <Header />
          <div className="flex w-full">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default Index;
