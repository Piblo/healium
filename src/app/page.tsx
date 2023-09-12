import Image from "next/image";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import image from "../../public/Doctor and Patient Isometric Illustration.svg";

export default function Home() {
  return (
    <>
      <main>
        <section className="min-h-[40dvh] py-8 w-full overflow-hidden flex flex-col justify-center">
          <Image
            height={300}
            width={300}
            src={image}
            alt=""
            className="object-cover mx-auto mb-4 dark:opacity-70"
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
        </section>
      </main>
    </>
  );
}
