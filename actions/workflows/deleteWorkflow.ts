"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflow(id: string) {
    const session = await auth();
    const {userId} = session;

    if (!userId) {
        throw new Error("unathenticated")
    }
await prisma.workflow.delete({
    where: {
        id,
        userId,
    },
  });

  revalidatePath("/workflows");
}