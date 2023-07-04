import { UserButton, auth, currentUser } from "@clerk/nextjs";

import { Nav } from "@/components/Nav";

export default async function Home() {
  return (
    <>
      <Nav />
      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    </>
  );
}
