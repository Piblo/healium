"use client";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateHealthEntity() {
  const mutation = trpc.healthEntity.create.useMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  });
  const { toast } = useToast();

  async function onSubmit(values: FormValues) {
    await mutation.mutateAsync({
      name: values.name,
    });
    toast({
      title: "Entidad sanitaria creada correctamente",
    });
    form.reset();
  }

  return (
    <div className="container max-w-sm mx-auto p-4">
      <h1 className="text-xl mb-6">Crear entidad sanitaria</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Crear entidad
          </Button>
        </form>
      </Form>
    </div>
  );
}

const schema = z.object({
  name: z.string().nonempty("Introduce un nombre para la entidad sanitaria"),
});

type FormValues = z.infer<typeof schema>;
