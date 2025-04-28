"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
    id, 
    cron,
}:{
    id: string; 
    cron: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

    try {
        const interval = (parser as any).parseExpression(cron, {utc: true});
        await prisma.workflow.update({
            where: {id, userId},
            data: {
                cron,
                nextRunAt: interval.next().toDate(),
            },
        });
    } catch (error: any) {
        console.error("invalid cron:", error.message);
        throw new Error("Invalid cron expression");
    }

    revalidatePath("/workflows");
}