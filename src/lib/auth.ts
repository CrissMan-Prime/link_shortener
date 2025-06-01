import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { LoginSchema } from "@/schema"
import { compare } from "bcrypt-ts"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "@/data/account"

declare module "next-auth" {
    interface Session {
        user: {
            uuid: string;
            name: string;
            firstName: string;
            email: string;
            role: string;
            money: string;
        } & DefaultSession["user"];
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "password", type: "password" },
            },
            authorize: async (credentials) => {
                const session = await auth()
                const email = credentials.email as string;
                const password = credentials.password as string;
                const validatedData = LoginSchema.safeParseAsync(credentials);
                
                if (session) {
                    throw new Error("You are connected");
                };
                if (!validatedData) {
                    throw new Error("Invalid Data");
                };
                if (!email || !password) {
                    throw new CredentialsSignin("Please provide both email and password");
                };
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!user || !user?.email) {
                    throw new Error("Invalid email or password");
                };
                const isMatched = await compare(password, user?.password);

                if (!isMatched) {
                    throw new Error("Password did not matched");
                };
                const userData = {
                    id: user.id,
                    uuid: user.uuid,
                    name: user.name,
                    email: user.email,
                };

                return userData;
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        maxAge: 864000,
        updateAge: 86400,
        strategy: "jwt",
    },
    callbacks: {

        async jwt({ token }) {

            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;
            const existingAccount = await getAccountByUserId(existingUser.id);
            token.isOauth = !!existingAccount;
            token.uuid = existingUser.uuid;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.firstName = existingUser.firstName
            token.picture = existingUser?.image;
            return token;
        },

        async session({ token, session }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    uuid: token.uuid,
                    name: token.name,
                    email: token.email,
                    role: token.role,
                    image: token.picture,
                    firstName: token.firstName,
                    money: token.money,
                    isOauth: token.isOauth,
                },
            };
        },
    },
});
