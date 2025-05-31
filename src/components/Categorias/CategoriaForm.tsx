
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
import { Categoria } from '@/types';

const categoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional()
});

type CategoriaFormData = Omit<Categoria, 'id'>;

interface CategoriaFormProps {
  categoria?: Categoria;
  onClose?: () => void;
}

export function CategoriaForm({ categoria, onClose }: CategoriaFormProps) {
  const [isOpen, setIsOpen] = useState(!!categoria);
  const { agregarCategoria, actualizarCategoria } = useStore();
  const { toast } = useToast();
  const isEditing = !!categoria;

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || ''
    }
  });

  const onSubmit = (data: CategoriaFormData) => {
    try {
      if (isEditing && categoria) {
        actualizarCategoria(categoria.id, data);
        toast({
          title: "Categoría actualizada",
          description: "La categoría se ha actualizado exitosamente",
        });
      } else {
        agregarCategoria(data);
        toast({
          title: "Categoría creada",
          description: "La categoría se ha creado exitosamente",
        });
      }
      form.reset();
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${isEditing ? 'actualizar' : 'crear'} la categoría`,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen && !isEditing) {
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
        <CardTitle>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
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
                {isEditing ? 'Actualizar' : 'Crear'} Categoría
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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
