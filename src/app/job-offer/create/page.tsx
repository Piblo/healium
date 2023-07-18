"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { RangeDatePicker } from "@/components/RangeDatepicker";
import RegionSearch from "@/components/RegionSearch";
import { Textarea } from "@/components/ui/textarea";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateJobOffer() {
  const healthEntityId = getSelectedHealthEntityId()!;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const { toast } = useToast();

  const mutation = trpc.jobOffer.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Oferta de trabajo creada correctamente",
      });
    },
  });

  const contractType = form.watch("contract.type");

  function handleDateChanged(dateRange: DateRange | undefined) {
    form.setValue("contract.startDate", dateRange?.from, {
      shouldValidate: true,
    });
    form.setValue("contract.endDate", dateRange?.to, { shouldValidate: true });
  }

  function onSubmit(values: FormValues) {
    mutation.mutate({
      city: values.city,
      contractType: values.contract.type,
      description: values.description,
      healthEntityId: healthEntityId,
      region: values.region,
      title: values.title,
      endDate: values.contract.endDate,
      startDate: values.contract.startDate,
    });
  }

  console.log(form.formState.errors);

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
                <FormLabel>Título</FormLabel>
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
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="region"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl>
                  <RegionSearch
                    onSelect={(value) =>
                      form.setValue("region", value, { shouldValidate: true })
                    }
                    value={field.value}
                  />
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
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contract.type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de contrato</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value as FormValues["contract"]["type"])
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
          {contractType === "fixed-term" && (
            <FormField
              name="contract.startDate"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormControl>
                    <RangeDatePicker
                      onSelect={handleDateChanged}
                      from={form.watch("contract.startDate")}
                      to={form.watch("contract.endDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button className="mt-4" type="submit" loading={mutation.isLoading}>
            Crear oferta
          </Button>
        </form>
      </Form>
    </div>
  );
}

const schema = z.object({
  title: z.string({
    required_error: "Introduce un título",
  }),
  description: z.string({
    required_error: "Introduce una descripción",
  }),
  region: z.string({
    required_error: "Elige una provincia",
  }),
  city: z.string(),
  contract: z
    .object({
      type: z.enum(["full-time", "part-time", "fixed-term"], {
        required_error: "Especifica el tipo de contrato",
      }),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .refine(
      (schema) =>
        schema.type !== "fixed-term" ||
        (schema.type === "fixed-term" && schema.startDate && schema.endDate),
      {
        path: ["startDate"],
        message: "Introduce una fecha",
      }
    ),
});
type FormValues = z.infer<typeof schema>;
