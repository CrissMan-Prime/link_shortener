import * as z from "zod";


export const RegisterSchema = z.object({
    email: z
        .string()
        .nonempty({
            message: "The email must not be empty",
        })
        .max(64, { message: "Your email is too long, the limit is 64 letters." })
        .email({
            message: "Please add a valid email",
        })
        .includes("gmail.com", { message: "Must include gmail.com" }),
    firstName: z
        .string()
        .nonempty({
            message: "The firs name must not be empty",
        })
        .max(15, { message: "Your name is too long, the limit is 15 letters." })
        .min(3, {
            message: "The name must be at least 3 characters long",
        }),
    name: z
        .string()
        .nonempty({
            message: "The name must not be empty",
        })
        .max(15, { message: "Your name is too long, the limit is 15 letters." })
        .min(3, {
            message: "The name must be at least 3 characters long",

        }),
    password: z
        .string()
        .nonempty({
            message: "The password must not be empty",
        })
        .max(30, { message: "Your password is too long, the limit is 30 letters." })
        .min(6, {
            message: "The password must be at least 6 characters long",
        }),
});

export const LoginSchema = z.object({
    email: z.string()
        .email({
            message: "Enter a valid email",
        })
        .nonempty({
            message: "The email must not be empty",
        }),
    password: z.string()
        .min(6, {
            message: "The password must be at least 6 characters long",
        })
        .nonempty({
            message: "The password must not be empty",
        }),
});

export const ShortenerSchema = z.object({
    original: z
        .string()
        .includes("https://", { message: "Must include https://" })
        .nonempty({
            message: "The link must not be empty",
        })
        .min(3, {
            message: "The name must be at least 3 characters long",

        }),
    author: z
        .string()
        .nonempty({
            message: "The uuid must not be empty",
        })
        .min(3, {
            message: "The uuid must be at least 3 characters long",

        }),
})

export const ShortenerUpdateSchema = z.object({
    original: z
        .string()
        .includes("https://", { message: "Must include https://" })
        .nonempty({
            message: "The link must not be empty",
        })
        .min(3, {
            message: "The name must be at least 3 characters long",

        })
        .optional(),
    uuid: z
        .string()
        .nonempty({
            message: "The link must not be empty",
        })
        .min(3, {
            message: "The name must be at least 3 characters long",

        }),
    owner: z
        .string()
        .nonempty({
            message: "The uuid must not be empty",
        })
        .min(3, {
            message: "The uuid must be at least 3 characters long",

        }),
})
