import { Briefcase, Calendar, MapPin } from "lucide-react";
import {
	Button,
	Font,
	Head,
	Html,
	Img,
	Tailwind,
} from "@react-email/components";
/* eslint-disable @next/next/no-img-element */
import { JobApplication, JobOffer } from "@/server/database/schema";

import { User } from "@clerk/nextjs/dist/types/server";
import { addDays } from "date-fns";
import { formatDateRange } from "@/utils/date";
import { getAssetUrl } from "./_utils/cdn";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { getContractTypeLabel } from "@/utils/contractType";
import tailwindConfig from "../../tailwind.config";

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
				<Font
					fontFamily="Inter"
					fallbackFontFamily="Verdana"
					webFont={{
						format: "woff2",
						url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
					}}
				/>
			</Head>
			<Tailwind config={tailwindConfig}>
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
					<h1 className="text-xl font-semibold mb-2">
						Nueva solicitud de empleo
					</h1>
					<p className="text-neutral-700 mb-6">
						Nueva solicitud de empleo recibida para el puesto{" "}
						<strong>{jobOffer.title}</strong>
					</p>

					<article className="mb-6">
						<div className="flex gap-2 items-center mb-4">
							<Img
								width={48}
								height={48}
								src={applicant.imageUrl}
								className="rounded-full"
							/>
							<strong>{applicant.fullName}</strong>
						</div>
						<div className="text-neutral-700">
							{jobApplication.startDate && jobApplication.endDate && (
								<div className="mb-2 flex items-center gap-2 text-sm">
									<Calendar size={16} />
									{formatDateRange(
										jobApplication.startDate,
										jobApplication.endDate,
									)}
								</div>
							)}
							<div className="mb-2 flex items-center gap-2 text-sm">
								<MapPin size={16} /> {jobOffer.city} ({jobOffer.region})
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Briefcase size={16} />{" "}
								{getContractTypeLabel(jobOffer.contractType)}
							</div>
						</div>
					</article>
					<Button
						href={`${getBaseUrl()}/job-offer/${jobOffer.id}/applications`}
						className="bg-blue-500 rounded text-white px-4 py-3"
					>
						Ver solicitud
					</Button>
				</main>
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
