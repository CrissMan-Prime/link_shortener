// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
}

declare module "next-auth/jwt" {
    interface JWT {
        idToken?: string;
    }
}
