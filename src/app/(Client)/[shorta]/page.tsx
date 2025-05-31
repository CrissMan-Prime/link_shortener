import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type Params = Promise<{ shorta: string }>;

export default async function Shorta({ params }: { params: Params }) {
  const { shorta } = await params;

  const link = await prisma.link.findUnique({
    where: {
      shorta,
    },
    select: {
      original: true,
    },
  });

  if (!link) {
    redirect("/");
  }

  redirect(link?.original as string);

  return null;
}
