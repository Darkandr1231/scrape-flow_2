"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth"; 
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
    id,
    definition,
}:{
    id: string;
    definition: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;
    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId,
        },
    });

    if (!workflow) {
        throw new Error("workflow not found");
    }
    
    if (workflow.status !== WorkflowStatus.DRAFT) { 
        throw new Error("workflow is not a draft");
    }

    await prisma.workflow.update({
        data: {
            definition,
        },
        where: {
            id, 
            userId,
        },
    });

    revalidatePath("/workflows");
}