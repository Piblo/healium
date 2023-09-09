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
import { UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";
import { getSelectedHealthEntityId } from "@/utils/healthEntity";
import { trpc } from "@/trpc/client";

export const Nav = () => {
  const { user, isSignedIn } = useUser();
  const { data } = trpc.user.healthEntities.useQuery(undefined, {
    enabled: isSignedIn,
  });

  const isHealthEntityAdmin = Boolean(user?.publicMetadata.healthEntityAdmin);
  const selectedHealthEntityId = getSelectedHealthEntityId();

  return (
    <NavigationMenu className="px-4 h-16 max-w-none border-b border-solid border-slate-300 justify-start">
      <div className="flex flex-1">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Healium
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {isSignedIn && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-max gap-3 p-4 grid-cols-1">
                  <li>
                    <Link
                      href="/job-offer/applications"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Mis solicitudes
                      </NavigationMenuLink>
                    </Link>
                  </li>
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
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </div>
      <NavigationMenuList>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <NavigationMenuItem>
            <Link href="/sign-in">Iniciar sesión</Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
