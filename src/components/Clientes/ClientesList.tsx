
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';
import { ClienteForm } from './ClienteForm';

export function ClientesList() {
  const { clientes } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Clientes
        </h1>
      </div>

      <ClienteForm />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({clientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay clientes registrados
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{cliente.tipo_documento}</Badge>
                        <span>{cliente.documento}</span>
                      </div>
                    </TableCell>
                    <TableCell>{cliente.telefono || '-'}</TableCell>
                    <TableCell>{cliente.email || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
