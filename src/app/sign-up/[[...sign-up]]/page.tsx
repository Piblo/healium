import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center py-6">
      <SignUp />
    </div>
  );
}
