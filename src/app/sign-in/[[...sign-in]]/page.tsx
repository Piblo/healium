import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col py-4 items-center">
      <h1 className="text-2xl mb-8">
        Para continuar, inicia sesión en Healium
      </h1>
      <SignIn />
    </div>
  );
}
