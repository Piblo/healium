import {
	Button,
	Font,
	Head,
	Hr,
	Html,
	Img,
	Tailwind,
} from "@react-email/components";

import { getBaseUrl } from "@/utils/getBaseUrl";

type HealthEntityInviteEmailProps = {
	healthEntityName: string;
	healthEntityId: string;
};

const HealthEntityInviteEmail = ({
	healthEntityName,
	healthEntityId,
}: HealthEntityInviteEmailProps) => {
	return (
		<Html>
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
				<header className="flex gap-2 items-center">
					<Img width={48} height={48} src="/static/healium-icon.png" alt="" />
					<span className="text-lg font-semibold">HEALIUM</span>
				</header>
				<Hr />
				<main className="text-base">
					<h1 className="text-xl mb-4">Bienvenido a Healium</h1>
					<p className="text-neutral-700">
						Has sido invitado a administrar <strong>{healthEntityName}</strong>
					</p>
					<Button
						href={`${getBaseUrl()}/health-entity/${healthEntityId}/join`}
						className="bg-blue-500 rounded text-white px-4 py-3"
					>
						Aceptar invitación
					</Button>
				</main>
			</Tailwind>
		</Html>
	);
};

export default HealthEntityInviteEmail;

HealthEntityInviteEmail.PreviewProps = {
	healthEntityId: "health-entity-id",
	healthEntityName: "Hospital de Ronda",
} as HealthEntityInviteEmailProps;
