
import { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/contexts/StoreContext';
import { ItemVenta, Cliente } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function VentaCarrito() {
  const { productos, clientes, registrarVenta, actualizarStock } = useStore();
  const { toast } = useToast();
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    documento: '',
    tipoDocumento: 'DNI' as 'DNI' | 'RUC'
  });

  const agregarAlCarrito = (productoId: string, cantidad: number = 1) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    if (cantidad > producto.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${producto.stock} unidades disponibles`,
        variant: "destructive"
      });
      return;
    }

    setCarrito(prev => {
      const itemExistente = prev.find(item => item.producto.id === productoId);
      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        if (nuevaCantidad > producto.stock) {
          toast({
            title: "Stock insuficiente",
            description: `Solo hay ${producto.stock} unidades disponibles`,
            variant: "destructive"
          });
          return prev;
        }
        return prev.map(item =>
          item.producto.id === productoId
            ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * producto.precio }
            : item
        );
      } else {
        return [...prev, {
          producto,
          cantidad,
          subtotal: cantidad * producto.precio
        }];
      }
    });
  };

  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto || nuevaCantidad > producto.stock) return;

    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito(prev => prev.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * producto.precio }
        : item
    ));
  };

  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  const procesarVenta = () => {
    if (carrito.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de procesar la venta",
        variant: "destructive"
      });
      return;
    }

    if (!clienteSeleccionado && !nuevoCliente.nombre) {
      toast({
        title: "Cliente requerido",
        description: "Selecciona un cliente o ingresa los datos de uno nuevo",
        variant: "destructive"
      });
      return;
    }

    let cliente = clienteSeleccionado;
    if (!cliente && nuevoCliente.nombre) {
      cliente = {
        id: Date.now().toString(),
        ...nuevoCliente
      };
    }

    if (!cliente) return;

    const venta = {
      fecha: new Date(),
      cliente,
      items: carrito,
      total,
      estado: 'completada' as const
    };

    registrarVenta(venta);
    
    // Actualizar stock
    carrito.forEach(item => {
      actualizarStock(item.producto.id, item.cantidad);
    });

    // Limpiar carrito
    setCarrito([]);
    setClienteSeleccionado(null);
    setNuevoCliente({ nombre: '', documento: '', tipoDocumento: 'DNI' });

    toast({
      title: "Venta procesada",
      description: `Venta por S/. ${total.toFixed(2)} registrada exitosamente`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nueva Venta</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Selecciona productos y procesa la venta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos disponibles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productos.filter(p => p.stock > 0).map(producto => (
                  <div key={producto.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{producto.nombre}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{producto.marca}</p>
                        <p className="text-lg font-bold text-green-600">S/. {producto.precio.toFixed(2)}</p>
                      </div>
                      <span className="text-sm text-gray-500">Stock: {producto.stock}</span>
                    </div>
                    <Button
                      onClick={() => agregarAlCarrito(producto.id)}
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrito y cliente */}
        <div className="space-y-6">
          {/* Carrito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Carrito ({carrito.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {carrito.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Carrito vacío</p>
              ) : (
                <div className="space-y-3">
                  {carrito.map(item => (
                    <div key={item.producto.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.producto.nombre}</h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">S/. {item.producto.precio.toFixed(2)} c/u</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarDelCarrito(item.producto.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.cantidad}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-semibold">S/. {item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-xl font-bold text-green-600">S/. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Cliente Existente</Label>
                  <Select
                    value={clienteSeleccionado?.id || ''}
                    onValueChange={(value) => {
                      const cliente = clientes.find(c => c.id === value);
                      setClienteSeleccionado(cliente || null);
                      if (cliente) {
                        setNuevoCliente({ nombre: '', documento: '', tipoDocumento: 'DNI' });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre} - {cliente.documento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center text-gray-500">o</div>

                <div>
                  <Label htmlFor="nombre">Nuevo Cliente</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre completo"
                    value={nuevoCliente.nombre}
                    onChange={(e) => {
                      setNuevoCliente(prev => ({ ...prev, nombre: e.target.value }));
                      setClienteSeleccionado(null);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={nuevoCliente.tipoDocumento}
                    onValueChange={(value: 'DNI' | 'RUC') => 
                      setNuevoCliente(prev => ({ ...prev, tipoDocumento: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="RUC">RUC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Número"
                    value={nuevoCliente.documento}
                    onChange={(e) => setNuevoCliente(prev => ({ ...prev, documento: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={procesarVenta} className="w-full" size="lg">
            Procesar Venta
          </Button>
        </div>
      </div>
    </div>
  );
}
