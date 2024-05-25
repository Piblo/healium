"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type BackButtonProps = {
	href?: string;
	className?: string;
} & PropsWithChildren;

export const BackButton = ({
	children = "Atrás",
	href,
	className,
}: BackButtonProps) => {
	const router = useRouter();

	if (!href) {
		return (
			<button
				className={clsx("flex text-sm items-center hover:underline", className)}
				onClick={router.back}
			>
				<ChevronLeft className="-ml-1" /> {children}
			</button>
		);
	}

	return (
		<Link
			href={href}
			className={clsx(
				"inline-flex text-sm items-center hover:underline",
				className,
			)}
		>
			<ChevronLeft className="-ml-1" /> {children}
		</Link>
	);
};
