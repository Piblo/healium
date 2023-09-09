import { User } from "@clerk/nextjs/dist/types/server";

export function getPrimaryEmailAddress(user: User) {
  return user.emailAddresses.find((x) => x.id === user.primaryEmailAddressId);
}
