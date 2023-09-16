import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import clsx from "clsx";

type BackButtonProps = {
  href: string;
  className?: string;
} & PropsWithChildren;

export const BackButton = ({
  children = "Atrás",
  href,
  className,
}: BackButtonProps) => {
  return (
    <Link href={href} className={clsx("flex text-sm items-center", className)}>
      <ChevronLeft /> {children}
    </Link>
  );
};
