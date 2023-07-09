import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center py-4">
      <h1 className="text-2xl mb-8">Regístrate gratis en Healium</h1>
      <SignUp />
    </div>
  );
}
