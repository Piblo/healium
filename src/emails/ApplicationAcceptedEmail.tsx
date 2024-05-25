import {
	Button,
	Font,
	Head,
	Html,
	Img,
	Tailwind,
} from "@react-email/components";
import { HealthEntity, JobOffer } from "@/server/database/schema";

import { getAssetUrl } from "./_utils/cdn";
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
						url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
					}}
				/>
			</Head>
			<Tailwind>
				<main className="text-base">
					<header className="flex justify-center mb-8">
						<Img
							className="text-center"
							width={48}
							height={48}
							src={getAssetUrl("healium-icon.png")}
							alt=""
						/>
					</header>

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
