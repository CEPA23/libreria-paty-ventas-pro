
export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  categoria_id?: string;
  categoria?: Categoria;
  created_at?: string;
  updated_at?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  documento: string;
  tipo_documento: 'DNI' | 'RUC';
  telefono?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ItemVenta {
  id: string;
  venta_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
  created_at?: string;
}

export interface Venta {
  id: string;
  fecha: string;
  cliente_id?: string;
  total: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
  cliente?: Cliente;
  items?: ItemVenta[];
  created_at?: string;
  updated_at?: string;
}
