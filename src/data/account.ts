import { prisma } from "@/lib/prisma";

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                userId: userId,
            },
        });
        return account;
    } catch {
        return null;
    }
};
