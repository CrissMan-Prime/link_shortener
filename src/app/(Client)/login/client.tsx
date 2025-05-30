"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schema";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation";

export default function Client() {
  const { data: session } = useSession()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      toast.error("Internal Error", {
        description: `${err}`,
      });
    }
  };
  if(session) {
    redirect("/")
  }
  return (
    <div className="flex h-full justify-center items-center ">
      <Card className="lg:w-[50%] xl:w-[27%]">
        <CardHeader className=" text-center">
          <CardTitle className="text-5xl pt-5">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full justify-center">
          <div className="w-[80%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-start">email</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-start">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center"></CardFooter>
      </Card>
    </div>
  );
}
