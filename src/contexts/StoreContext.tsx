
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Producto, Categoria, Cliente, Venta } from '@/types';

interface StoreContextType {
  productos: Producto[];
  categorias: Categoria[];
  clientes: Cliente[];
  ventas: Venta[];
  agregarProducto: (producto: Omit<Producto, 'id'>) => void;
  actualizarProducto: (id: string, producto: Partial<Producto>) => void;
  eliminarProducto: (id: string) => void;
  agregarCategoria: (categoria: Omit<Categoria, 'id'>) => void;
  agregarCliente: (cliente: Omit<Cliente, 'id'>) => void;
  registrarVenta: (venta: Omit<Venta, 'id'>) => void;
  actualizarStock: (productoId: string, cantidadVendida: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const categoriasIniciales: Categoria[] = [
  { id: '1', nombre: 'Cuadernos', descripcion: 'Cuadernos y libretas' },
  { id: '2', nombre: 'Lapiceros', descripcion: 'Bolígrafos y plumas' },
  { id: '3', nombre: 'Útiles Escolares', descripcion: 'Material escolar básico' },
  { id: '4', nombre: 'Papelería', descripcion: 'Papel y material de oficina' },
  { id: '5', nombre: 'Artículos de Arte', descripcion: 'Materiales para dibujo y pintura' }
];

const productosIniciales: Producto[] = [
  { id: '1', nombre: 'Cuaderno Cuadriculado A4', marca: 'Stanford', precio: 8.50, stock: 25, categoria: 'Cuadernos' },
  { id: '2', nombre: 'Lapicero Azul', marca: 'Pilot', precio: 2.00, stock: 50, categoria: 'Lapiceros' },
  { id: '3', nombre: 'Borrador Blanco', marca: 'Faber-Castell', precio: 1.50, stock: 30, categoria: 'Útiles Escolares' },
  { id: '4', nombre: 'Hojas Bond A4', marca: 'Copy', precio: 12.00, stock: 20, categoria: 'Papelería' },
  { id: '5', nombre: 'Lápices de Colores x12', marca: 'Faber-Castell', precio: 15.50, stock: 15, categoria: 'Artículos de Arte' }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useLocalStorage<Producto[]>('libreria-productos', productosIniciales);
  const [categorias, setCategorias] = useLocalStorage<Categoria[]>('libreria-categorias', categoriasIniciales);
  const [clientes, setClientes] = useLocalStorage<Cliente[]>('libreria-clientes', []);
  const [ventas, setVentas] = useLocalStorage<Venta[]>('libreria-ventas', []);

  const agregarProducto = (nuevoProducto: Omit<Producto, 'id'>) => {
    const producto: Producto = {
      ...nuevoProducto,
      id: Date.now().toString()
    };
    setProductos(prev => [...prev, producto]);
  };

  const actualizarProducto = (id: string, datosActualizados: Partial<Producto>) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, ...datosActualizados } : p));
  };

  const eliminarProducto = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const agregarCategoria = (nuevaCategoria: Omit<Categoria, 'id'>) => {
    const categoria: Categoria = {
      ...nuevaCategoria,
      id: Date.now().toString()
    };
    setCategorias(prev => [...prev, categoria]);
  };

  const agregarCliente = (nuevoCliente: Omit<Cliente, 'id'>) => {
    const cliente: Cliente = {
      ...nuevoCliente,
      id: Date.now().toString()
    };
    setClientes(prev => [...prev, cliente]);
  };

  const registrarVenta = (nuevaVenta: Omit<Venta, 'id'>) => {
    const venta: Venta = {
      ...nuevaVenta,
      id: Date.now().toString()
    };
    setVentas(prev => [...prev, venta]);
  };

  const actualizarStock = (productoId: string, cantidadVendida: number) => {
    setProductos(prev => prev.map(p => 
      p.id === productoId 
        ? { ...p, stock: Math.max(0, p.stock - cantidadVendida) }
        : p
    ));
  };

  return (
    <StoreContext.Provider value={{
      productos,
      categorias,
      clientes,
      ventas,
      agregarProducto,
      actualizarProducto,
      eliminarProducto,
      agregarCategoria,
      agregarCliente,
      registrarVenta,
      actualizarStock
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
