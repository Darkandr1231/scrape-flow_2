"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";

export async function SetupUser() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }

    const userId = session.user.id;

    const balance = await prisma.userBalance.findUnique({where: {userId}});
    if (!balance) {
        // Free 100 credits
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 100,
            },
        });
    }

    redirect("/");
}