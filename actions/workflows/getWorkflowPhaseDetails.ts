"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 

export async function GetWorkflowPhaseDetails(phaseId: string){
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,
            execution: {
                userId,
            },
        },
        include: {
            logs: {
                orderBy: {
                    timestamp: "asc",
                },
            },
        },  
    });
}