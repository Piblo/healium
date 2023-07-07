"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function Members({ params }: Props) {
  const { data } = trpc.healthEntity.members.useQuery({
    healthEntityId: params.id,
  });

  const { mutate } = trpc.healthEntity.inviteMember.useMutation();

  const [emailAddress, setEmailAddress] = useState<string>();

  return (
    <div className="container py-4">
      <h1 className="text-2xl mb-4">Miembros</h1>
      <Input
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
      />
      <Button
        className="mb-4"
        onClick={() =>
          mutate({
            emailAddress: emailAddress!,
          })
        }
      >
        Invitar miembro
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((member) => (
            <TableRow key={member.email}>
              <TableCell>
                {member.firstName} {member.lastName}
              </TableCell>
              <TableCell>{member.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
