
export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  categoria: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  documento: string;
  tipoDocumento: 'DNI' | 'RUC';
  telefono?: string;
  email?: string;
}

export interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  fecha: Date;
  cliente: Cliente;
  items: ItemVenta[];
  total: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
}
