import {
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
} from "@react-email/components";

import { Header } from "./_components/Header";
import { Typography } from "./_components/Typography";
import { User } from "@clerk/nextjs/dist/types/server";
import { getAssetUrl } from "./_utils/cdn";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getPrimaryEmailAddress } from "@/server/utils/user";

type HealthEntityInviteEmailProps = {
  healthEntityName: string;
  healthEntityId: string;
  inviter: User;
  healthEntityLogo?: string | null;
};

const HealthEntityInviteEmail = ({
  healthEntityName,
  healthEntityId,
  healthEntityLogo,
  inviter,
}: HealthEntityInviteEmailProps) => {
  const inviterEmailAddress = getPrimaryEmailAddress(inviter)?.emailAddress;
  return (
    <Html>
      <Head>
        <Typography />
      </Head>
      <Tailwind>
        <Container>
          <Header />
          <main className="text-base">
            <h1 className="text-xl mb-4">Bienvenido a Healium</h1>
            <p className="mb-8">
              <strong>{inviter.fullName}</strong> (
              <Link href={`mailto:${inviterEmailAddress}`}>
                {inviterEmailAddress}
              </Link>
              ) te ha invitado a la entidad sanitaria{" "}
              <strong>{healthEntityName}</strong> en <strong>Healium</strong>.
            </p>
            <Section className="mb-8">
              <Row>
                <Column align="right">
                  <Img
                    src={inviter.imageUrl ?? getAssetUrl("user.png")}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </Column>
                <Column align="center">
                  <Img src={getAssetUrl("arrow-right.png")} width={18} />
                </Column>
                <Column>
                  <Img
                    src={healthEntityLogo ?? getAssetUrl("hospital.png")}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center">
              <Button
                href={`${getBaseUrl()}/health-entity/${healthEntityId}/join`}
                className="bg-blue-500 rounded text-white px-5 py-3 font-semibold"
              >
                Aceptar invitación
              </Button>
            </Section>
          </main>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default HealthEntityInviteEmail;

HealthEntityInviteEmail.PreviewProps = {
  healthEntityId: "health-entity-id",
  healthEntityName: "Hospital de Ronda",
  healthEntityLogo: "https://picsum.photos/64?random=1",
  inviter: {
    fullName: "Pablo Guerrero",
    primaryEmailAddressId: "1",
    imageUrl: "https://picsum.photos/64?random=2",
    emailAddresses: [
      {
        id: "1",
        emailAddress: "pablo@healium.com",
      },
    ],
  },
} as HealthEntityInviteEmailProps;
