import Image from "next/image";
import { SearchOfferForm } from "@/components/SearchOfferForm";

export default function Home() {
  return (
    <>
      <main>
        <div className="relative min-h-[40dvh] py-8 w-full overflow-hidden flex flex-col justify-center">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            objectFit="cover"
            className="opacity-60 -z-10"
            priority
          />
          <div className="container">
            <h1 className="text-2xl lg:text-4xl text-center mb-6">
              Encuentra tu trabajo ideal en enfermería
            </h1>
            <div>
              <SearchOfferForm className="mx-auto max-w-4xl" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
