import { CalendarClock, Heart, MapPinned } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { SearchOfferForm } from "@/components/SearchOfferForm";
import image from "../../public/Doctor and Patient Isometric Illustration.svg";

export default function Home() {
  return (
    <>
      <main>
        <section className="py-8 w-full overflow-hidden flex flex-col justify-center">
          <Image
            height={300}
            width={300}
            src={image}
            alt=""
            className="object-cover mx-auto mb-4"
            priority
          />
          <div className="container">
            <h1 className="text-2xl font-semibold lg:text-4xl text-center mb-8">
              Encuentra tu trabajo ideal en enfermería
            </h1>
            <SearchOfferForm className="mx-auto max-w-xl" />
          </div>
          <div className="py-8 mt-8">
            <div className="container space-y-8">
              <p className="text-muted-foreground text-p text-center text-wrap-balance">
                Nuestra plataforma está diseñada para conectar a profesionales
                de la salud con oportunidades de trabajo en el sector privado,
                ofreciendo la flexibilidad y los beneficios que merecen
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <div className="mb-4 flex gap-4">
                      <CalendarClock className="shrink-0" />
                      <CardTitle className="text-2xl/7">
                        Contratos indefinidos y de corta duración
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Ofrecemos una variedad de contratos, desde posiciones
                      estables a largo plazo hasta contratos cortos para quienes
                      buscan ingresos adicionales
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="mb-4 flex gap-4">
                      <MapPinned className="shrink-0" />
                      <CardTitle className="text-2xl/7">
                        Ofertas de trabajo en toda España
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Accede a una amplia red de entidades privadas en busca de
                      profesionales Amplía tus horizontes profesionales y gana
                      experiencia
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="mb-4 flex gap-4">
                      <Heart className="shrink-0" />
                      <CardTitle className="text-2xl/7">
                        Facilidad y Conveniencia
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Con nuestra intuitiva plataforma, puedes buscar y aplicar
                      a ofertas de trabajo fácilmente para conseguir esos
                      ingresos extra que tanto buscas. Busca en las fechas que
                      más te convenga y el puesto que mejor se adapte a ti
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
