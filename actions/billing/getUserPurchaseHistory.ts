"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetUserPurchaseHistory() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  return prisma.userPurchase.findMany({
    where: { userId: session.user.id },
    orderBy: {
      date: "desc",
    },
  });
}