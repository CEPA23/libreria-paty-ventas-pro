
import { useState } from 'react';
import { Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';
import { ProductoForm } from './ProductoForm';
import { Producto } from '@/types';

export function ProductosList() {
  const { productos, eliminarProducto } = useStore();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | undefined>();

  const handleEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setMostrarForm(true);
  };

  const handleCerrarForm = () => {
    setMostrarForm(false);
    setProductoEditar(undefined);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (stock <= 5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  if (mostrarForm) {
    return <ProductoForm onSubmit={handleCerrarForm} productoEditar={productoEditar} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gestiona el inventario de la librería</p>
        </div>
        <Button onClick={() => setMostrarForm(true)} className="flex items-center space-x-2">
          <Package className="w-4 h-4" />
          <span>Agregar Producto</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map(producto => (
          <Card key={producto.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{producto.marca}</p>
                </div>
                <Badge variant="outline">{producto.categoria}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">S/. {producto.precio.toFixed(2)}</span>
                  <Badge className={getStockColor(producto.stock)}>
                    {producto.stock} en stock
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditar(producto)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => eliminarProducto(producto.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No hay productos registrados
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Comienza agregando tu primer producto al inventario
          </p>
          <Button onClick={() => setMostrarForm(true)}>
            Agregar Primer Producto
          </Button>
        </div>
      )}
    </div>
  );
}
