
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const chartConfig = {
  cantidad: {
    label: "Cantidad Vendida",
  },
  ingresos: {
    label: "Ingresos (S/.)",
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function Reportes() {
  const { ventas, productos } = useStore();

  const reporteData = useMemo(() => {
    // Calcular productos más vendidos
    const ventasPorProducto = new Map<string, { cantidad: number; ingresos: number; producto: any }>();
    
    ventas.forEach(venta => {
      if (venta.estado === 'completada') {
        venta.items.forEach(item => {
          const key = item.producto.id;
          const existing = ventasPorProducto.get(key);
          if (existing) {
            existing.cantidad += item.cantidad;
            existing.ingresos += item.subtotal;
          } else {
            ventasPorProducto.set(key, {
              cantidad: item.cantidad,
              ingresos: item.subtotal,
              producto: item.producto
            });
          }
        });
      }
    });

    const productosVendidos = Array.from(ventasPorProducto.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    // Calcular ventas por categoría
    const ventasPorCategoria = new Map<string, { cantidad: number; ingresos: number }>();
    
    productosVendidos.forEach(item => {
      const categoria = item.producto.categoria;
      const existing = ventasPorCategoria.get(categoria);
      if (existing) {
        existing.cantidad += item.cantidad;
        existing.ingresos += item.ingresos;
      } else {
        ventasPorCategoria.set(categoria, {
          cantidad: item.cantidad,
          ingresos: item.ingresos
        });
      }
    });

    const categorias = Array.from(ventasPorCategoria.entries()).map(([nombre, data]) => ({
      nombre,
      ...data
    }));

    // Estadísticas generales
    const totalVentas = ventas.filter(v => v.estado === 'completada').length;
    const totalIngresos = ventas
      .filter(v => v.estado === 'completada')
      .reduce((sum, venta) => sum + venta.total, 0);
    
    const ventasHoy = ventas.filter(v => {
      const today = new Date();
      const ventaDate = new Date(v.fecha);
      return v.estado === 'completada' && 
        ventaDate.getDate() === today.getDate() &&
        ventaDate.getMonth() === today.getMonth() &&
        ventaDate.getFullYear() === today.getFullYear();
    }).length;

    const productosConBajoStock = productos.filter(p => p.stock <= 5);

    return {
      productosVendidos,
      categorias,
      estadisticas: {
        totalVentas,
        totalIngresos,
        ventasHoy,
        productosConBajoStock: productosConBajoStock.length
      },
      productosConBajoStock
    };
  }, [ventas, productos]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reportes y Estadísticas
        </h1>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Ventas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reporteData.estadisticas.totalVentas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ingresos Totales
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  S/. {reporteData.estadisticas.totalIngresos.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ventas Hoy
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reporteData.estadisticas.ventasHoy}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Stock Bajo
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {reporteData.estadisticas.productosConBajoStock}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {reporteData.productosVendidos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay datos de ventas
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={reporteData.productosVendidos.slice(0, 5)}>
                  <XAxis 
                    dataKey="producto.nombre" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cantidad" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Ventas por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {reporteData.categorias.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay datos de ventas
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={reporteData.categorias}
                    dataKey="cantidad"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                  >
                    {reporteData.categorias.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabla de productos más vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Productos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {reporteData.productosVendidos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay productos vendidos
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Cantidad Vendida</TableHead>
                  <TableHead>Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reporteData.productosVendidos.map((item, index) => (
                  <TableRow key={item.producto.id}>
                    <TableCell className="font-medium">
                      {item.producto.nombre}
                      <div className="text-sm text-gray-500">{item.producto.marca}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>S/. {item.ingresos.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Productos con stock bajo */}
      {reporteData.productosConBajoStock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Productos con Stock Bajo (≤ 5 unidades)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reporteData.productosConBajoStock.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">
                      {producto.nombre}
                      <div className="text-sm text-gray-500">{producto.marca}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{producto.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{producto.stock}</Badge>
                    </TableCell>
                    <TableCell>S/. {producto.precio.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
