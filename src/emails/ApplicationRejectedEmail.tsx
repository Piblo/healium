import {
  Button,
  Container,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { HealthEntity, JobOffer } from "@/server/database/schema";

import { Header } from "./_components/Header";
import { Typography } from "./_components/Typography";
import { getBaseUrl } from "@/utils/getBaseUrl";

type ApplicationRejectedEmailProps = {
  jobOffer: JobOffer;
  healthEntity: HealthEntity;
};

const ApplicationRejectedEmail = ({
  jobOffer,
  healthEntity,
}: ApplicationRejectedEmailProps) => {
  return (
    <Html lang="es-ES">
      <Head>
        <Typography />
      </Head>
      <Tailwind>
        <Container>
          <main className="text-base">
            <Header />
            <h1 className="text-xl font-semibold mb-2">Solicitud rechazada</h1>
            <p className="mb-6">
              Lo sentimos, tu solicitud de trabajo para el puesto de{" "}
              <strong>
                {jobOffer.title} ({healthEntity.name})
              </strong>{" "}
              ha sido rechazada.
            </p>
            <p>
              Puedes seguir buscando nuevas ofertas de empleo en Healium. ¡Te
              deseamos mucha suerte!
            </p>
            <Button
              href={`${getBaseUrl()}/job-offer/search`}
              className="bg-blue-500 rounded text-white px-5 py-3 font-semibold"
            >
              Buscar nuevas ofertas
            </Button>
          </main>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default ApplicationRejectedEmail;

ApplicationRejectedEmail.PreviewProps = {
  healthEntity: {
    name: "Hospital de Ronda",
  },
  jobOffer: {
    id: "01HW7SHJ4F18YKDEECRFXTEGMK",
    title: "Enfermero en cardiologia",
  },
} as ApplicationRejectedEmailProps;
