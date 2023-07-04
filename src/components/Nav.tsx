"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { SignInButton, UserButton, auth, useAuth } from "@clerk/nextjs";

import Link from "next/link";

export const Nav = () => {
  const { isSignedIn } = useAuth();

  return (
    <NavigationMenu className="w-full px-4 h-16 border-b border-solid border-slate-300 flex items-center">
      <div className="flex-1">HEALIUM</div>
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
