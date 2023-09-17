import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { getQueryKey } from "@trpc/react-query";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const InviteMember = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const mutation = trpc.healthEntity.inviteMember.useMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { toast } = useToast();

  const queryClient = useQueryClient();
  const healthEntityId = getSelectedHealthEntityId()!;

  async function onSubmit(values: FormValues) {
    await mutation.mutateAsync({
      healthEntityId,
      emailAddress: values.email,
    });

    queryClient.refetchQueries(
      getQueryKey(trpc.healthEntity.members, { healthEntityId }, "query")
    );

    toast({
      title: "Invitación enviada correctamente",
    });

    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Invitar miembro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Invitar miembro</DialogTitle>
        <DialogDescription>
          Introduce una dirección de correo para invitar a un nuevo miembro
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nombre.apellido@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button type="submit" loading={mutation.isLoading}>
                Enviar invitación
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const schema = z.object({
  email: z
    .string()
    .min(1, "Introduce un email")
    .email("Introduce un email válido"),
});

type FormValues = z.infer<typeof schema>;
