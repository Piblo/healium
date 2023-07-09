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

import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { getCookie } from "cookies-next";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Members() {
  const healthEntityId = getCookie("healthEntityId") as string;
  const { data, refetch } = trpc.healthEntity.members.useQuery({
    healthEntityId: healthEntityId,
  });

  const { mutate } = trpc.healthEntity.inviteMember.useMutation();
  const { mutate: removeMember, isLoading: removeMemberLoading } =
    trpc.healthEntity.removeMember.useMutation({
      onSuccess: () => {
        setDeleteModalOpen(false);
        refetch();
      },
    });
  const [emailAddress, setEmailAddress] = useState<string>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <div className="container py-4">
      <h1 className="text-2xl mb-4">Miembros</h1>
      <div className="flex gap-4">
        <Input
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="nombre.apellido@email.com"
          className="max-w-md"
        />
        <Button
          className="mb-4"
          onClick={() =>
            mutate({
              emailAddress: emailAddress!,
              healthEntityId: healthEntityId,
            })
          }
          loading
        >
          Invitar miembro
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
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
                  <DialogTrigger>
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
                      <DialogClose>
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
    </div>
  );
}
