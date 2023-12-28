"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  NavigationMenuSub,
  NavigationMenuViewport,
} from "@radix-ui/react-navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Separator } from "./ui/separator";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";

export const Nav = () => {
  const { user } = useUser();
  const isHealthEntityAdmin = Boolean(user?.publicMetadata.healthEntityAdmin);
  const { data } = trpc.user.healthEntities.useQuery(undefined, {
    enabled: isHealthEntityAdmin,
  });

  const selectedHealthEntityId = getSelectedHealthEntityId();

  return (
    <NavigationMenu className="px-4 h-16 max-w-none border-b border-solid border-slate-300 justify-start">
      <div className="flex flex-1">
        <NavigationMenuList>
          <SignedIn>
            <NavigationMenuItem className="flex items-center md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Menu />
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="text-left">Healium</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link
                        className="text-muted-foreground"
                        href="/job-offer/applications"
                      >
                        Mis solicitudes
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link className="text-muted-foreground" href="/profile">
                        CV
                      </Link>
                    </SheetClose>
                  </div>
                  {!!user?.publicMetadata.healiumAdmin && (
                    <>
                      <Separator className="my-6" />
                      <div className="mt-4 flex flex-col gap-2">
                        <span className="font-semibold">Entidad sanitaria</span>
                        <SheetClose asChild>
                          <Link
                            className="text-muted-foreground"
                            href="/health-entity/create"
                          >
                            Crear entidad sanitaria
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            className="text-muted-foreground"
                            href="/health-entity/manage"
                          >
                            Administrar entidad sanitaria
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            className="text-muted-foreground"
                            href="/health-entity/choose"
                          >
                            Elegir entidad sanitaria
                          </Link>
                        </SheetClose>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            </NavigationMenuItem>
          </SignedIn>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Healium
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <SignedIn>
            <NavigationMenuItem className="hidden md:block">
              <Link href="/job-offer/applications" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Mis solicitudes
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <Link href="/profile" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  CV
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuTrigger>
                <NavigationMenuLink href="/health-entity/manage">
                  Entidad sanitaria
                </NavigationMenuLink>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuSub orientation="vertical">
                  <NavigationMenuList className="grid w-max gap-3 p-4 grid-cols-1">
                    {!!user?.publicMetadata.healiumAdmin && (
                      <li>
                        <Link
                          href="/health-entity/create"
                          legacyBehavior
                          passHref
                        >
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            Crear entidad sanitaria
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    )}
                    {isHealthEntityAdmin && selectedHealthEntityId && (
                      <li>
                        <Link
                          href="/health-entity/manage"
                          legacyBehavior
                          passHref
                        >
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            Administrar entidad sanitaria
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    )}
                    {data?.length && data.length > 1 ? (
                      <li>
                        <Link
                          href="/health-entity/choose"
                          legacyBehavior
                          passHref
                        >
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            Elegir entidad sanitaria
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ) : null}
                  </NavigationMenuList>
                </NavigationMenuSub>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </SignedIn>
        </NavigationMenuList>
      </div>
      <NavigationMenuList>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <NavigationMenuItem>
            <Link href="/sign-in">Iniciar sesión</Link>
          </NavigationMenuItem>
        </SignedOut>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
