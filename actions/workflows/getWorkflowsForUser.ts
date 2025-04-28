"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 

export async function GetWorkflowsForUser() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    return prisma.workflow.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    })
}