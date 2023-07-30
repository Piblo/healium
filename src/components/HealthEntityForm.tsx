import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Button } from "./ui/button";
import Image from "next/image";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { UploadButton } from "./UploadButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUploadThing } from "./uploadthing/uploadthing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type HealthEntityFormProps = {
  onSubmit: (values: HealthEntityFormValues) => void;
  isSubmitting?: boolean;
  values?: HealthEntityFormValues;
  submitButtonText: string;
};

export const HealthEntityForm = ({
  onSubmit,
  values,
  isSubmitting,
  submitButtonText,
}: HealthEntityFormProps) => {
  const [logo, setLogo] = useState<File>();
  const { isUploading, startUpload } = useUploadThing("image");

  const form = useForm<FormValues>({
    defaultValues: values,
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (formValues: FormValues) => {
    let logoUrl = values?.logoUrl;
    if (logo) {
      const uploadResponse = await startUpload([logo]);

      logoUrl = uploadResponse?.[0].fileUrl;
    }

    onSubmit({
      ...formValues,
      logoUrl,
    });
  };

  const logoUrl =
    (logo ? URL.createObjectURL(logo) : undefined) ?? values?.logoUrl;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono de contacto</FormLabel>
              <FormControl>
                <Input inputMode="tel" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input inputMode="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel className="block">Logo</FormLabel>
          {logoUrl && <Image width="100" height="100" src={logoUrl} alt="" />}
          <UploadButton
            variant="secondary"
            onFileSelected={(files) => setLogo(files[0])}
          >
            Subir logo
          </UploadButton>
        </FormItem>
        <Button
          type="submit"
          className="w-full mt-6"
          loading={isUploading || isSubmitting}
        >
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

const schema = z.object({
  name: z.string({
    required_error: "Introduce un nombre",
  }),
  address: z.string({
    required_error: "Introduce una dirección",
  }),
  phoneNumber: z.string({ required_error: "Introduce un número de teléfono" }),
  email: z
    .string({
      required_error: "Introduce un email de contacto",
    })
    .email("Introduce un email válido"),
});

type FormValues = z.infer<typeof schema>;

export type HealthEntityFormValues = FormValues & {
  logoUrl?: string | null;
};
