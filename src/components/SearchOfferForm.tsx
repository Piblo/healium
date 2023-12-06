"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "./ui/button";
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
    },
  });
  const router = useRouter();

  function onSubmit(values: FormValues) {
    const region = values.region === "Toda España" ? "" : values.region;

    router.push(`/job-offer/search?region=${region ?? ""}`);
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
                  allowAnyRegion
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
  region: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
