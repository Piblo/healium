"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { DeleteJobOfferModal } from "./DeleteJobOfferModal";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

type Props = {
  jobOfferId: string;
};

export const JobOfferDropdownMenu = ({ jobOfferId }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full h-10 w-10 text-muted-foreground p-0"
          variant="outline"
        >
          <MoreHorizontal size="18" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link className="w-full" href={`/job-offer/${jobOfferId}/edit`}>
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
          Borrar
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteJobOfferModal
        jobOfferId={jobOfferId}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </DropdownMenu>
  );
};
