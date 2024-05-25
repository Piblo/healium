import {
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
} from "@react-email/components";
/* eslint-disable @next/next/no-img-element */
import { JobApplication, JobOffer } from "@/server/database/schema";

import { Header } from "./_components/Header";
import { Typography } from "./_components/Typography";
import { User } from "@clerk/nextjs/dist/types/server";
import { addDays } from "date-fns";
import { formatDateRange } from "@/utils/date";
import { getBaseUrl } from "@/utils/getBaseUrl";

type ApplicationSentEmailProps = {
  jobApplication: JobApplication;
  jobOffer: JobOffer;
  applicant: User;
};

export const ApplicationSentEmail = ({
  jobApplication,
  jobOffer,
  applicant,
}: ApplicationSentEmailProps) => {
  return (
    <Html lang="es-ES">
      <Head>
        <Typography />
      </Head>
      <Tailwind>
        <Container>
          <main className="text-base">
            <Header />
            <h1 className="text-xl font-semibold mb-2">
              Nueva solicitud de empleo
            </h1>
            <p className="mb-6">
              Nueva solicitud de empleo recibida para el puesto{" "}
              <strong>{jobOffer.title}</strong>
            </p>

            <Section className="mb-6">
              <Row className="gap-2 mb-4">
                <Column width={48}>
                  <Img
                    width={48}
                    height={48}
                    src={applicant.imageUrl}
                    className="rounded-full mr-2"
                  />
                </Column>
                <Column>
                  <strong className="text-lg">{applicant.fullName}</strong>
                </Column>
              </Row>

              <Row>
                <Column>
                  <strong>Ciudad:</strong> {jobOffer.city} ({jobOffer.region})
                </Column>
              </Row>
              {jobApplication.startDate && jobApplication.endDate && (
                <Row>
                  <Column>
                    <strong>Duración:</strong>{" "}
                    {formatDateRange(
                      jobApplication.startDate,
                      jobApplication.endDate,
                    )}
                  </Column>
                </Row>
              )}
            </Section>
            <Button
              href={`${getBaseUrl()}/job-offer/${jobOffer.id}/applications`}
              className="bg-blue-500 rounded text-white px-5 py-3 font-semibold"
            >
              Ver solicitud
            </Button>
          </main>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default ApplicationSentEmail;

ApplicationSentEmail.PreviewProps = {
  applicant: {
    imageUrl: "https://picsum.photos/200",
    fullName: "Pablo Guerrero",
  },
  jobOffer: {
    title: "Enfermero en cardiologia",
    city: "Ronda",
    region: "Malaga",
    contractType: "fixed-term",
    id: "01HW7SHJ4F18YKDEECRFXTEGMK",
  },
  jobApplication: {
    startDate: new Date(),
    endDate: addDays(new Date(), 10),
  },
} as ApplicationSentEmailProps;
