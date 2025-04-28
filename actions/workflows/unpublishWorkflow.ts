"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth"; 
import { revalidatePath } from "next/cache";

export async function UnpublishWorkflow(id: string) {
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

    if (workflow.status !== WorkflowStatus.PUBLISHED) {
        throw new Error("workflow is not published");
    }

    await prisma.workflow.update({
        where: {
            id,
            userId,
        },
        data: {
            status: WorkflowStatus.DRAFT,
            executionPlan: null,
            creditsCost: 0,
        },
    });

    revalidatePath(`/workflow/editor/${id}`);
}