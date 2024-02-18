"use client";

import { Download, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeleteCv } from "./DeleteCv";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadCv } from "./UploadCv";
import { trpc } from "@/trpc/client";

export default function Profile() {
  const { data: profile, isLoading } = trpc.candidate.profile.useQuery();

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold mb-6">Mi perfil</h1>
      <div className="flex flex-col gap-2 max-w-md">
        <Label htmlFor="cv">Curriculum Vitae</Label>
        {isLoading && <Skeleton className="h-[58px] w-[448px]" />}
        {profile?.cvUrl ? (
          <>
            <Button
              asChild
              variant="outline"
              className="p-4 h-auto justify-start flex gap-2"
            >
              <Link
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download />
                {profile.cvFileName}
              </Link>
            </Button>

            <DeleteCv />
          </>
        ) : (
          !isLoading && (
            <div>
              <UploadCv />
              <p className="mt-4 flex gap-2 text-muted-foreground">
                <Info />
                Sube tu CV para que las entidades sanitarias puedan verlo junto
                a tus solicitudes de empleo
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
