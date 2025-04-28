"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 

export async function GetWorkflowExecutionWithPhases(executionId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    return prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
            userId,
        },
        include: {
            phases: {
                orderBy: {
                    number: "asc",
                },
            },
        },
    });
}