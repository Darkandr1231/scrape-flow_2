"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 
import { revalidatePath } from "next/cache";

export async function DeleteCredential(name: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unathenticated");
    }

    const userId = session.user.id;

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