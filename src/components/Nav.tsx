"use client";

import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link, { LinkProps } from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

import { ReactNode } from "react";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./ThemeToggle";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";

export const Nav = () => {
  const { user } = useUser();
  const isHealthEntityAdmin = Boolean(user?.publicMetadata.healthEntityAdmin);
  const { data } = trpc.user.healthEntities.useQuery(undefined, {
    enabled: isHealthEntityAdmin,
  });
  const selectedHealthEntityId = getSelectedHealthEntityId();
  const isHealiumAdmin = !!user?.publicMetadata.healiumAdmin;

  return (
    <nav className="w-full p-3  border-b-neutral-400 flex container">
      <ul className="flex gap-2 flex-1 text-sm items-center">
        <li className="flex md:hidden hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded cursor-pointer font-semibold focus:bg-black/10 dark:focus:bg-white/10 focus:outline-none">
          <Sheet>
            <SheetTrigger>
              <Menu aria-label="Toggle navigation menu" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-left">Healium</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2">
                <SheetClose asChild>
                  <Link
                    className="text-muted-foreground hover:underline"
                    href="/job-offer/applications"
                  >
                    Mis solicitudes
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    className="text-muted-foreground hover:underline"
                    href="/profile"
                  >
                    CV
                  </Link>
                </SheetClose>
              </div>
              {(isHealthEntityAdmin || isHealiumAdmin) && (
                <>
                  <Separator className="my-6" />
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="font-semibold">Entidad sanitaria</span>
                    {isHealiumAdmin && (
                      <SheetClose asChild>
                        <Link
                          className="text-muted-foreground hover:underline"
                          href="/health-entity/create"
                        >
                          Crear entidad sanitaria
                        </Link>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <Link
                        className="text-muted-foreground hover:underline"
                        href="/health-entity/manage"
                      >
                        Administrar entidad sanitaria
                      </Link>
                    </SheetClose>
                    {data?.length && data.length > 1 ? (
                      <SheetClose asChild>
                        <Link
                          className="text-muted-foreground hover:underline"
                          href="/health-entity/choose"
                        >
                          Elegir entidad sanitaria
                        </Link>
                      </SheetClose>
                    ) : null}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </li>
        <li>
          <NavLink href="/">Healium</NavLink>
        </li>
        <SignedIn>
          <li className="hidden md:block">
            <NavLink href="/job-offer/applications">Mis solicitudes</NavLink>
          </li>
          <li className="hidden md:block">
            <NavLink href="/profile">CV</NavLink>
          </li>
        </SignedIn>
        {isHealthEntityAdmin && (
          <li className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-2 items-center hover:bg-black/10 dark:hover:bg-white/10 px-4 py-3 rounded cursor-pointer font-semibold focus:bg-black/10 dark:focus:bg-white/10 focus:outline-none">
                Entidad sanitaria <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 space-y-2">
                {!!user?.publicMetadata.healiumAdmin && (
                  <DropdownMenuItem className="font-semibold" asChild>
                    <Link
                      href="/health-entity/create"
                      className="w-full px-4 cursor-pointer"
                    >
                      Crear entidad sanitaria
                    </Link>
                  </DropdownMenuItem>
                )}
                {isHealthEntityAdmin && selectedHealthEntityId && (
                  <DropdownMenuItem className="font-semibold" asChild>
                    <Link
                      href="/health-entity/manage"
                      className="w-full px-4 cursor-pointer"
                    >
                      Administrar entidad sanitaria
                    </Link>
                  </DropdownMenuItem>
                )}
                {data?.length && data.length > 1 ? (
                  <DropdownMenuItem className="font-semibold" asChild>
                    <Link
                      href="/health-entity/choose"
                      className="w-full px-4 cursor-pointer"
                    >
                      Elegir entidad sanitaria
                    </Link>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
      <ul className="flex gap-2 text-sm items-center">
        <li>
          <ThemeToggle />
        </li>
        <SignedIn>
          <li className="p-2">
            <UserButton afterSignOutUrl="/" />
          </li>
        </SignedIn>
        <SignedOut>
          <li>
            <NavLink href="/sign-in">Iniciar sesión</NavLink>
          </li>
        </SignedOut>
      </ul>
    </nav>
  );
};

const NavLink = (props: LinkProps & { children: ReactNode }) => (
  <Link
    {...props}
    className="hover:bg-black/10 dark:hover:bg-white/10 px-4 py-3 rounded cursor-pointer font-semibold focus:bg-black/10 dark:focus:bg-white/10 focus:outline-none"
  />
);
