"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { trpc } from "@/utils/trpc";

export const DeleteButton = ({ jobOfferId }: { jobOfferId: string }) => {
  const mutation = trpc.jobOffer.delete.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Borrar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Borrar oferta de trabajo?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres borrar esta oferta de trabajo?
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() =>
                mutation.mutate({
                  jobOfferId,
                })
              }
              loading={mutation.isLoading}
            >
              Sip
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">No</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
