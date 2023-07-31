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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { InviteMember } from "@/components/InviteMember";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function Members() {
  const healthEntityId = getSelectedHealthEntityId()!;
  const { data, refetch } = trpc.healthEntity.members.useQuery({
    healthEntityId: healthEntityId!,
  });

  const { mutate: removeMember } = trpc.healthEntity.removeMember.useMutation({
    onSuccess: () => {
      setDeleteModalOpen(false);
      refetch();
    },
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <div className="container py-4">
      <BackButton href="/health-entity/manage" className="mb-4" />
      <h1 className="text-2xl mb-4">Miembros</h1>

      <Table className="mb-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado de invitación</TableHead>
            <TableHead>Fecha de invitación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((member) => (
            <TableRow key={member.email}>
              <TableCell>
                {member.firstName} {member.lastName}
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.status}</TableCell>
              <TableCell>{member.invitedDate.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Dialog
                  open={deleteModalOpen}
                  onOpenChange={setDeleteModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Eliminar miembro</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar miembro</DialogTitle>
                      <DialogDescription>
                        ¿Quieres eliminar a{" "}
                        {member.firstName
                          ? `${member.firstName} ${member.lastName}`
                          : member.email}{" "}
                        de esta entidad sanitaria?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          removeMember({
                            healthEntityId,
                            userId: member.userId!,
                          })
                        }
                      >
                        Eliminar miembro
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InviteMember />
    </div>
  );
}
