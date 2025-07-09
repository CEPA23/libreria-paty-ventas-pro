
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';
import { Cliente } from '@/types';

const clienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  documento: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  tipo_documento: z.enum(['DNI', 'RUC']),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal(''))
});

type ClienteFormData = Omit<Cliente, 'id'>;

export function ClienteForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { agregarCliente } = useStore();
  const { toast } = useToast();

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: '',
      documento: '',
      tipo_documento: 'DNI',
      telefono: '',
      email: ''
    }
  });

  const onSubmit = (data: ClienteFormData) => {
    try {
      const clienteData = {
        ...data,
        telefono: data.telefono || undefined,
        email: data.email || undefined
      };
      agregarCliente(clienteData);
      toast({
        title: "Cliente registrado",
        description: "El cliente se ha registrado exitosamente",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el cliente",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        <Plus className="w-4 h-4 mr-2" />
        Nuevo Cliente
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Nuevo Cliente</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(false);
            form.reset();
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="RUC">RUC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 987654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: cliente@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                Registrar Cliente
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
