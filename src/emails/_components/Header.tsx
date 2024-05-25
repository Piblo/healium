import { Container, Img } from "@react-email/components";

import { getAssetUrl } from "../_utils/cdn";

export const Header = () => {
	return (
		<header className="mb-8">
			<Container>
				<Img
					width={48}
					height={48}
					src={getAssetUrl("healium-icon.png")}
					alt=""
				/>
			</Container>
		</header>
	);
};
