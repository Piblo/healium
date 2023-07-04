"use client";

import { Nav } from "@/components/Nav";
import { trpc } from "@/utils/trpc";

function Home() {
  return (
    <>
      <Nav />
      <main></main>
    </>
  );
}

export default trpc.withTRPC(Home);
