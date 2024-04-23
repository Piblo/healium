"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  jobOfferId: string;
  open: boolean;
  onClose: () => void;
};

export const DeleteJobOfferModal = ({ jobOfferId, open, onClose }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const mutation = trpc.jobOffer.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Oferta de trabajo borrada",
        description: "La oferta de trabajo ha sido borrada correctamente",
      });
      onClose();
      router.refresh();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Borrar oferta de trabajo?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres borrar esta oferta de trabajo?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() =>
              mutation.mutate({
                jobOfferId,
              })
            }
            loading={mutation.isLoading}
          >
            Borrar
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
