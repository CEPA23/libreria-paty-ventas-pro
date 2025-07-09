import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/contexts/StoreContext';
import { Producto } from '@/types';

interface ProductoFormProps {
  onSubmit: () => void;
  productoEditar?: Producto;
}

export function ProductoForm({ onSubmit, productoEditar }: ProductoFormProps) {
  const { categorias, agregarProducto, actualizarProducto } = useStore();
  const [formData, setFormData] = useState({
    nombre: productoEditar?.nombre || '',
    marca: productoEditar?.marca || '',
    precio: productoEditar?.precio || 0,
    stock: productoEditar?.stock || 0,
    categoria_id: productoEditar?.categoria_id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, formData);
      } else {
        await agregarProducto(formData);
      }
      setFormData({ nombre: '', marca: '', precio: 0, stock: 0, categoria_id: '' });
      onSubmit();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {productoEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="marca">Marca</Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="precio">Precio (S/.)</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Select
              value={formData.categoria_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {productoEditar ? 'Actualizar Producto' : 'Agregar Producto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}