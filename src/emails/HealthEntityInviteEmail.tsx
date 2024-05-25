import {
	Button,
	Font,
	Head,
	Html,
	Img,
	Tailwind,
} from "@react-email/components";

import { getAssetUrl } from "./_utils/cdn";
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
						url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
					}}
				/>
			</Head>
			<Tailwind>
				<header className="flex justify-center mb-8">
					<Img
						className="text-center"
						width={48}
						height={48}
						src={getAssetUrl("healium-icon.png")}
						alt=""
					/>
				</header>
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
