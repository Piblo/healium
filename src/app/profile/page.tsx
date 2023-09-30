"use client";

import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteCv } from "./DeleteCv";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UploadCv } from "./UploadCv";
import { trpc } from "@/trpc/client";

export default function Profile() {
  const { data: profile, isLoading } = trpc.candidate.profile.useQuery();

  if (isLoading) {
    return (
      <div className="container py-6">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-xl mb-4">Perfil</h1>
      <div className="flex flex-col gap-2 max-w-md">
        <Label htmlFor="cv">Curriculum Vitae</Label>
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
          <UploadCv />
        )}
      </div>
    </div>
  );
}
