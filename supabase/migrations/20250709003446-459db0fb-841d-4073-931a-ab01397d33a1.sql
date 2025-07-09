-- Create categorias table
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create productos table
CREATE TABLE public.productos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  marca TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clientes table
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  documento TEXT NOT NULL,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('DNI', 'RUC')),
  telefono TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ventas table
CREATE TABLE public.ventas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  total DECIMAL(10,2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create items_venta table for sale items
CREATE TABLE public.items_venta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venta_id UUID REFERENCES public.ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items_venta ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - adjust as needed)
CREATE POLICY "Enable all operations for categorias" ON public.categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for productos" ON public.productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for ventas" ON public.ventas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for items_venta" ON public.items_venta FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON public.productos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at
  BEFORE UPDATE ON public.ventas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial categories
INSERT INTO public.categorias (nombre, descripcion) VALUES
  ('Cuadernos', 'Cuadernos y libretas'),
  ('Lapiceros', 'Bolígrafos y plumas'),
  ('Útiles Escolares', 'Material escolar básico'),
  ('Papelería', 'Papel y material de oficina'),
  ('Artículos de Arte', 'Materiales para dibujo y pintura');