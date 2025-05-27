
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

const categoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional()
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

export function CategoriaForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { agregarCategoria } = useStore();
  const { toast } = useToast();

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: '',
      descripcion: ''
    }
  });

  const onSubmit = (data: CategoriaFormData) => {
    try {
      agregarCategoria(data);
      toast({
        title: "Categoría creada",
        description: "La categoría se ha creado exitosamente",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        <Plus className="w-4 h-4 mr-2" />
        Nueva Categoría
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Nueva Categoría</CardTitle>
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
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cuadernos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción de la categoría"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit">
                Crear Categoría
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
