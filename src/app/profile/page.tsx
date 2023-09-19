import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  return (
    <div className="container max-w-screen-lg py-6">
      <h1 className="text-xl mb-4">Perfil</h1>
      <div className="flex flex-col gap-2 max-w-md">
        <Label htmlFor="cv">Curriculum Vitae</Label>
        <Input id="cv" type="file" accept="application/pdf" />
        <Button>Subir CV</Button>
      </div>
    </div>
  );
}
