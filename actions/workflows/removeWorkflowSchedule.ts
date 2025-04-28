"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 
import { revalidatePath } from "next/cache";

export async function RemoveWorkflowSchedule(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    await prisma.workflow.update({
        where: {id, userId},
        data: {
            cron: null,
            nextRunAt: null,
        },
    });

    revalidatePath("/workflows");
}