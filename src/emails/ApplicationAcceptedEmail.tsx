import {
	Button,
	Font,
	Head,
	Hr,
	Html,
	Img,
	Tailwind,
} from "@react-email/components";
import { HealthEntity, JobOffer } from "@/server/database/schema";

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
				<Font
					fontFamily="Inter"
					fallbackFontFamily="Verdana"
					webFont={{
						format: "woff2",
						url: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
					}}
				/>
			</Head>
			<Tailwind>
				<main className="text-base">
					<header className="flex gap-2 items-center">
						<Img width={48} height={48} src="/static/healium-icon.png" alt="" />
						<span className="text-lg font-semibold">HEALIUM</span>
					</header>
					<Hr />
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
						className="bg-blue-500 rounded text-white px-4 py-3"
					>
						Ver oferta
					</Button>
				</main>
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
