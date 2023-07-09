import { User } from "@clerk/backend";

export function getPrimaryEmailAddress(user: User) {
  return user.emailAddresses.find((x) => x.id === user.primaryEmailAddressId);
}
