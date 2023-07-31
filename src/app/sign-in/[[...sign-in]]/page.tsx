import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container py-6 flex flex-col items-center">
      <SignIn />
    </div>
  );
}
