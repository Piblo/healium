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

export const Nav = () => {
  const { user, isSignedIn } = useUser();

  return (
    <NavigationMenu className="px-4 h-16 max-w-none border-b border-solid border-slate-300 flex items-center">
      <div className="flex flex-1">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            {!!user?.publicMetadata.healiumAdmin && (
              <NavigationMenuContent>
                <Link href="/health-entity/create" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Crear entidad sanitaria
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            )}
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
