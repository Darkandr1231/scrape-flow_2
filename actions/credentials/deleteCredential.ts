"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteCredential(name: string) {
    const session = await auth();
    const {userId} = session;
    if (!userId) {
        throw new Error("unauthenticated");
    }

    await prisma.credential.delete({
        where: {
            userId_name: {
                userId,
                name,
            },
        },
    });

    revalidatePath("/credentials");
}