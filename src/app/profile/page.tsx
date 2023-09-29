import { Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UploadCv } from "./UploadCv";
import { trpc } from "@/trpc/server";

export default async function Profile() {
  const profile = await trpc.candidate.profile.query();

  return (
    <div className="container max-w-screen-lg py-6">
      <h1 className="text-xl mb-4">Perfil</h1>
      <div className="flex flex-col gap-2 max-w-md">
        <Label htmlFor="cv">Curriculum Vitae</Label>
        {profile?.cvUrl ? (
          <Link
            href={profile.cvUrl}
            className="justify-start px-0 text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="mr-2" />
            {profile.cvFileName}
          </Link>
        ) : (
          <UploadCv />
        )}
      </div>
    </div>
  );
}
