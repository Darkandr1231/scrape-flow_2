"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@/auth";

export async function DownloadInvoice(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!purchase) {
    throw new Error("bad request");
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(
    purchase.stripeId
  );

  if (!stripeSession.invoice) {
    throw new Error("invoice not found");
  }

  const invoice = await stripe.invoices.retrieve(
    stripeSession.invoice as string
  );

  return invoice.hosted_invoice_url;
}