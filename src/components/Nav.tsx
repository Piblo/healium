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
import { trpc } from "@/utils/trpc";

export const Nav = () => {
  const { user, isSignedIn } = useUser();
  const { data } = trpc.user.healthEntities.useQuery();
  const selectedHealthEntityId = getSelectedHealthEntityId();

  return (
    <NavigationMenu className="px-4 h-16 max-w-none border-b border-solid border-slate-300 flex items-center">
      <div className="flex flex-1">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Healium
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col">
              {!!user?.publicMetadata.healiumAdmin && (
                <Link href="/health-entity/create" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Crear entidad sanitaria
                  </NavigationMenuLink>
                </Link>
              )}
              {selectedHealthEntityId && (
                <Link href="/health-entity/manage" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Administrar entidad sanitaria
                  </NavigationMenuLink>
                </Link>
              )}
              {data?.length && data.length > 1 ? (
                <Link href="/health-entity/choose" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Elegir entidad sanitaria
                  </NavigationMenuLink>
                </Link>
              ) : null}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
      <NavigationMenuList>
        {!isSignedIn && (
          <NavigationMenuItem>
            <Link href="/sign-in">Iniciar sesión</Link>
          </NavigationMenuItem>
        )}
        {isSignedIn && <UserButton />}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
