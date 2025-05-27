
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useStore } from '@/contexts/StoreContext';

export function Dashboard() {
  const { productos, ventas, clientes } = useStore();

  const ventasHoy = ventas.filter(venta => {
    const hoy = new Date();
    const fechaVenta = new Date(venta.fecha);
    return fechaVenta.toDateString() === hoy.toDateString();
  });

  const totalVentasHoy = ventasHoy.reduce((total, venta) => total + venta.total, 0);
  const productosConStock = productos.filter(p => p.stock > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Resumen general de la librería</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Productos"
          value={productos.length}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Productos en Stock"
          value={productosConStock}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Ventas Hoy"
          value={ventasHoy.length}
          icon={ShoppingCart}
          color="orange"
        />
        <StatsCard
          title="Total Clientes"
          value={clientes.length}
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ventas de Hoy</h3>
          <div className="text-3xl font-bold text-green-600">S/. {totalVentasHoy.toFixed(2)}</div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{ventasHoy.length} transacciones</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Productos con Stock Bajo</h3>
          <div className="space-y-2">
            {productos
              .filter(p => p.stock <= 5)
              .slice(0, 5)
              .map(producto => (
                <div key={producto.id} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{producto.nombre}</span>
                  <span className={`font-medium ${producto.stock <= 2 ? 'text-red-600' : 'text-orange-600'}`}>
                    {producto.stock} unidades
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
