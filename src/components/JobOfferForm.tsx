import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Button } from "./ui/button";
import { DateRange } from "react-day-picker";
import { Input } from "./ui/input";
import { RangeDatePicker } from "./RangeDatepicker";
import RegionSearch from "./RegionSearch";
import { Textarea } from "./ui/textarea";
import { getContractTypeLabel } from "@/utils/contractType";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type JobOfferFormProps = {
  onSubmit: (values: JobOfferFormValues) => void;
  isSubmitting?: boolean;
  values?: JobOfferFormValues;
  submitButtonLabel: string;
};

export const JobOfferForm = ({
  onSubmit,
  isSubmitting,
  values,
  submitButtonLabel,
}: JobOfferFormProps) => {
  const form = useForm<JobOfferFormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: values,
  });

  function handleDateChanged(dateRange: DateRange | undefined) {
    form.setValue("contract.startDate", dateRange?.from, {
      shouldValidate: true,
    });
    form.setValue("contract.endDate", dateRange?.to, { shouldValidate: true });
  }

  const contractType = form.watch("contract.type");

  return (
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
                  allowAnyRegion={false}
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
                    field.onChange(
                      value as JobOfferFormValues["contract"]["type"]
                    )
                  }
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">
                      {getContractTypeLabel("full-time")}
                    </SelectItem>
                    <SelectItem value="part-time">
                      {getContractTypeLabel("part-time")}
                    </SelectItem>
                    <SelectItem value="fixed-term">
                      {getContractTypeLabel("fixed-term")}
                    </SelectItem>
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

        <FormField
          name="hoursPerWeek"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas semanales (opcional)</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="salaryPerHour"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salario (€/hora)</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-4" type="submit" loading={isSubmitting}>
          {submitButtonLabel}
        </Button>
      </form>
    </Form>
  );
};

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
  hoursPerWeek: z.preprocess(
    (val) => parseFloat(String(val)),
    z
      .number({ invalid_type_error: "Introduce un número" })
      .positive("Introduce un número positivo")
      .optional()
  ),
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
  salaryPerHour: z.preprocess(
    (x) => parseFloat(String(x)),
    z.number().optional()
  ),
});

export type JobOfferFormValues = z.infer<typeof schema>;
