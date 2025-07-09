import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Producto, Categoria, Cliente, Venta, ItemVenta } from '@/types';

interface StoreContextType {
  productos: Producto[];
  categorias: Categoria[];
  clientes: Cliente[];
  ventas: Venta[];
  loading: boolean;
  agregarProducto: (producto: Omit<Producto, 'id'>) => Promise<void>;
  actualizarProducto: (id: string, producto: Partial<Producto>) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
  agregarCategoria: (categoria: Omit<Categoria, 'id'>) => Promise<void>;
  actualizarCategoria: (id: string, categoria: Partial<Categoria>) => Promise<void>;
  eliminarCategoria: (id: string) => Promise<void>;
  agregarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  registrarVenta: (venta: Omit<Venta, 'id'>) => Promise<void>;
  actualizarStock: (productoId: string, cantidadVendida: number) => Promise<void>;
  fetchData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categorias
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias')
        .select('*');
      
      if (categoriasError) throw categoriasError;
      
      // Fetch productos with categorias
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select(`
          *,
          categoria:categorias(*)
        `);
      
      if (productosError) throw productosError;
      
      // Fetch clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*');
      
      if (clientesError) throw clientesError;
      
      // Fetch ventas with clientes and items
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select(`
          *,
          cliente:clientes(*),
          items:items_venta(
            *,
            producto:productos(*)
          )
        `);
      
      if (ventasError) throw ventasError;
      
      setCategorias(categoriasData || []);
      setProductos(productosData || []);
      setClientes((clientesData || []) as Cliente[]);
      setVentas((ventasData || []) as Venta[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const agregarProducto = async (nuevoProducto: Omit<Producto, 'id'>) => {
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        nombre: nuevoProducto.nombre,
        marca: nuevoProducto.marca,
        precio: nuevoProducto.precio,
        stock: nuevoProducto.stock,
        categoria_id: nuevoProducto.categoria_id
      }])
      .select(`
        *,
        categoria:categorias(*)
      `);
    
    if (error) throw error;
    if (data) {
      setProductos(prev => [...prev, ...data]);
    }
  };

  const actualizarProducto = async (id: string, datosActualizados: Partial<Producto>) => {
    const { data, error } = await supabase
      .from('productos')
      .update(datosActualizados)
      .eq('id', id)
      .select(`
        *,
        categoria:categorias(*)
      `);
    
    if (error) throw error;
    if (data) {
      setProductos(prev => prev.map(p => p.id === id ? data[0] : p));
    }
  };

  const eliminarProducto = async (id: string) => {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const agregarCategoria = async (nuevaCategoria: Omit<Categoria, 'id'>) => {
    const { data, error } = await supabase
      .from('categorias')
      .insert([nuevaCategoria])
      .select();
    
    if (error) throw error;
    if (data) {
      setCategorias(prev => [...prev, ...data]);
    }
  };

  const actualizarCategoria = async (id: string, datosActualizados: Partial<Categoria>) => {
    const { data, error } = await supabase
      .from('categorias')
      .update(datosActualizados)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (data) {
      setCategorias(prev => prev.map(c => c.id === id ? data[0] : c));
    }
  };

  const eliminarCategoria = async (id: string) => {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    setCategorias(prev => prev.filter(c => c.id !== id));
  };

  const agregarCliente = async (nuevoCliente: Omit<Cliente, 'id'>) => {
    const { data, error } = await supabase
      .from('clientes')
      .insert([nuevoCliente])
      .select();
    
    if (error) throw error;
    if (data) {
      setClientes(prev => [...prev, ...(data as Cliente[])]);
    }
  };

  const registrarVenta = async (nuevaVenta: Omit<Venta, 'id'>) => {
    const { data: ventaData, error: ventaError } = await supabase
      .from('ventas')
      .insert([{
        cliente_id: nuevaVenta.cliente_id,
        total: nuevaVenta.total,
        estado: nuevaVenta.estado,
        fecha: nuevaVenta.fecha
      }])
      .select()
      .single();
    
    if (ventaError) throw ventaError;
    
    // Insert venta items
    if (nuevaVenta.items && nuevaVenta.items.length > 0) {
      const itemsToInsert = nuevaVenta.items.map(item => ({
        venta_id: ventaData.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal
      }));
      
      const { error: itemsError } = await supabase
        .from('items_venta')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;
    }
    
    // Fetch complete venta data
    const { data: completaVenta, error: fetchError } = await supabase
      .from('ventas')
      .select(`
        *,
        cliente:clientes(*),
        items:items_venta(
          *,
          producto:productos(*)
        )
      `)
      .eq('id', ventaData.id)
      .single();
    
    if (fetchError) throw fetchError;
    if (completaVenta) {
      setVentas(prev => [...prev, completaVenta as Venta]);
    }
  };

  const actualizarStock = async (productoId: string, cantidadVendida: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const nuevoStock = Math.max(0, producto.stock - cantidadVendida);
    
    const { data, error } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', productoId)
      .select(`
        *,
        categoria:categorias(*)
      `);
    
    if (error) throw error;
    if (data) {
      setProductos(prev => prev.map(p => p.id === productoId ? data[0] : p));
    }
  };

  return (
    <StoreContext.Provider value={{
      productos,
      categorias,
      clientes,
      ventas,
      loading,
      agregarProducto,
      actualizarProducto,
      eliminarProducto,
      agregarCategoria,
      actualizarCategoria,
      eliminarCategoria,
      agregarCliente,
      registrarVenta,
      actualizarStock,
      fetchData
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore debe ser usado dentro de un StoreProvider');
  }
  return context;
};