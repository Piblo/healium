"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RegionSearch from "@/components/RegionSearch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateJobOffer() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit() {}

  return (
    <div className="container py-4 max-w-lg">
      <BackButton href="/health-entity/manage" className="mb-4" />
      <h1 className="text-2xl mb-8">Crear nueva oferta</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Título</Label>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Descripción</Label>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Ciudad</Label>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contractType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Label>Tipo de contrato</Label>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value as FormValues["contractType"])
                    }
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Indefinido</SelectItem>
                      <SelectItem value="part-time">Tiempo parcial</SelectItem>
                      <SelectItem value="fixed-term">Temporal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit">
            Crear oferta
          </Button>
        </form>
      </Form>
    </div>
  );
}

const schema = z.object({
  title: z.string().min(1, "Introduce un título"),
  description: z.string().min(1, "Introduce una descripción"),
  city: z.string(),
  contractType: z.enum(["full-time", "part-time", "fixed-term"]),
});

type FormValues = z.infer<typeof schema>;
