
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, FolderOpen } from 'lucide-react';
import { CategoriaForm } from './CategoriaForm';

export function CategoriasList() {
  const { categorias, productos } = useStore();

  const getProductosEnCategoria = (categoriaNombre: string) => {
    return productos.filter(producto => producto.categoria === categoriaNombre).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Categorías
        </h1>
      </div>

      <CategoriaForm />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => {
          const productosCount = getProductosEnCategoria(categoria.nombre);
          
          return (
            <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2 flex-1">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{categoria.nombre}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {productosCount} producto{productosCount !== 1 ? 's' : ''}
                </Badge>
              </CardHeader>
              <CardContent>
                {categoria.descripcion && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {categoria.descripcion}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    disabled={productosCount > 0}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
                
                {productosCount > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    No se puede eliminar: tiene productos asociados
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categorias.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay categorías
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Crea tu primera categoría para organizar tus productos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
