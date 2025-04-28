"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 

export async function GetWorkflowExecutions(workflowId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    return prisma.workflowExecution.findMany({
        where: {
            workflowId,
            userId,
        },
        orderBy: {
            createdAt:"desc",
        },
    });
}