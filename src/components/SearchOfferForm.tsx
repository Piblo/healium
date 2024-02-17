"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { parseAsString, useQueryStates } from "next-usequerystate";

import { Button } from "./ui/button";
import { DateRange } from "react-day-picker";
import { RangeDatePicker } from "./RangeDatepicker";
import RegionSearch from "./RegionSearch";
import { addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

type SearchOfferFormProps = {
  className?: string;
};

export const SearchOfferForm = ({ className }: SearchOfferFormProps) => {
  const [search, setSearch] = useQueryStates({
    region: parseAsString,
    from: parseAsString,
    to: parseAsString,
  });

  const form = useForm<FormValues>({
    defaultValues: {
      region: search.region ?? "",
      startDate: search.from ? new Date(search.from) : new Date(),
      endDate: search.to ? new Date(search.to) : addDays(new Date(), 7),
    },
  });
  const router = useRouter();

  async function onSubmit(values: FormValues) {
    const region = values.region === "Toda España" ? "" : values.region;

    const res = await setSearch({
      from: values.startDate?.toISOString(),
      to: endDate ? endDate?.toISOString() : null,
      region: region,
    });

    router.push(`/job-offer/search?${res.toString()}`);
  }

  function handleDateChange(range?: DateRange) {
    form.setValue("startDate", range?.from);
    form.setValue("endDate", range?.to);
  }

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  return (
    <Form {...form}>
      <form
        className={cn(
          "flex flex-col md:flex-row justify-end w-full gap-4",
          className
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="startDate"
          control={form.control}
          render={() => (
            <FormItem className="flex-[2]">
              <FormLabel>Duración</FormLabel>
              <FormControl>
                <RangeDatePicker
                  onSelect={handleDateChange}
                  from={startDate}
                  to={endDate}
                  fromDate={new Date()}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="region"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-[2]">
              <FormLabel>Provincia</FormLabel>
              <FormControl>
                <RegionSearch
                  onSelect={(value) =>
                    form.setValue("region", value, { shouldValidate: true })
                  }
                  value={field.value}
                  allowAnyRegion
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="sm:self-end flex-1">
          Buscar
        </Button>
      </form>
    </Form>
  );
};

const schema = z.object({
  region: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FormValues = z.infer<typeof schema>;
