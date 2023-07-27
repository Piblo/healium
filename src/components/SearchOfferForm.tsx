"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import RegionSearch from "./RegionSearch";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SearchOfferFormProps = {
  className?: string;
};

export const SearchOfferForm = ({ className }: SearchOfferFormProps) => {
  const searchParams = useSearchParams();
  const form = useForm<FormValues>({
    defaultValues: {
      region: searchParams.get("region") ?? "",
      search: searchParams.get("search") ?? "",
    },
  });
  const router = useRouter();

  function onSubmit(values: FormValues) {
    router.push(
      `/job-offer/search?search=${values.search ?? ""}&region=${
        values.region ?? ""
      }`
    );
  }

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
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Busco ofertas de...</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="region"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Provincia</FormLabel>
              <FormControl>
                <RegionSearch
                  onSelect={(value) =>
                    form.setValue("region", value, { shouldValidate: true })
                  }
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="self-end">
          Buscar
        </Button>
      </form>
    </Form>
  );
};

const schema = z.object({
  search: z.string().optional(),
  region: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
