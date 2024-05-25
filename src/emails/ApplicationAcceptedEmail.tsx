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

type ApplicationAcceptedEmailProps = {
  jobOffer: JobOffer;
  healthEntity: HealthEntity;
};

const ApplicationAcceptedEmail = ({
  jobOffer,
  healthEntity,
}: ApplicationAcceptedEmailProps) => {
  return (
    <Html lang="es-ES">
      <Head>
        <Typography />
      </Head>
      <Tailwind>
        <Container>
          <main className="text-base">
            <Header />
            <h1 className="text-xl font-semibold mb-2">¡Enhorabuena!</h1>
            <p className="text-neutral-700 mb-6">
              Tu solicitud de trabajo para el puesto de{" "}
              <strong>
                {jobOffer.title} ({healthEntity.name})
              </strong>{" "}
              ha sido aceptada
            </p>
            <Button
              href={`${getBaseUrl()}/job-offer/${jobOffer.id}`}
              className="bg-blue-500 rounded text-white px-5 py-3 font-semibold"
            >
              Ver oferta
            </Button>
          </main>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default ApplicationAcceptedEmail;

ApplicationAcceptedEmail.PreviewProps = {
  healthEntity: {
    name: "Hospital de Ronda",
  },
  jobOffer: {
    id: "01HW7SHJ4F18YKDEECRFXTEGMK",
    title: "Enfermero en cardiologia",
  },
} as ApplicationAcceptedEmailProps;
