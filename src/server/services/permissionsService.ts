import { TRPCError } from "@trpc/server";
import { currentUser } from "@clerk/nextjs";
import { getHealthEntityMembers } from "../database/healthEntityRepository";

export async function checkUserIsHealthEntityMember(healthEntityId: string) {
  const user = await currentUser();
  const members = await getHealthEntityMembers(healthEntityId);
  if (members.find((x) => x.userId === user?.id)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not a member of the given health entity",
    });
  }
}
