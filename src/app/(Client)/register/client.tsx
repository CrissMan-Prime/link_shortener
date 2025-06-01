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
import { RegisterSchema } from "@/schema";
import { toast } from "sonner";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Client() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const message = (await response.json()).message as string;

      if (response.status >= 300 && response.status <= 599) {
        setLoading(false);
        toast.error("Error " + response.status, {
          description: `${message}`,
        });
        return null;
      }
      setLoading(false);
      toast.success("Success " + response.status, {
        description: `${message}`,
      });
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
          <CardTitle className="text-5xl pt-5">SignIn</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full justify-center">
          <div className="w-[80%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-row gap-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-start">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-start">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-start">Email</FormLabel>
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "loading.." : "Register"}
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
