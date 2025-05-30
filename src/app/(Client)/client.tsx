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
import { ShortenerSchema } from "@/schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import dotenv from "dotenv";

export default function Client() {
  dotenv.config();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [dataLink, setDataLink] = useState<
    {
      original: string;
      shorta: string;
    }[]
  >([]);

  const form = useForm<z.infer<typeof ShortenerSchema>>({
    resolver: zodResolver(ShortenerSchema),
    defaultValues: {
      original: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ShortenerSchema>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/link", {
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
    } catch (err) {
      toast.error("Internal Error", {
        description: `${err}`,
      });
    }
  };
  async function fetchLink() {
    const res = await fetch("/api/link");
    const data = await res.json();
    setDataLink(data);
  }

  useEffect(() => {
    fetchLink();
  }, [loading]);

  const columns: ColumnDef<{
    original: string;
    shorta: string;
  }>[] = [
    {
      accessorKey: "shorta",
      header: "Shorta",
      cell: ({ row }) => {
        const names = String(row.getValue("shorta"));

        return (
          <div className={`flex truncate max-w-60`}>
            <div className="">https://{names}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "original",
      header: () => <p className="text-start">Original</p>,
      cell: ({ row }) => {
        const names = String(row.getValue("original"));

        return (
          <div className={`flex truncate max-w-60`}>
            <div className="">{names}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex h-full justify-center pt-10">
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
                  <FormField
                    control={form.control}
                    name="original"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-start">Link</FormLabel>
                        <FormControl>
                          <Input placeholder=" insert your link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={() => {
                      form.setValue("author", `${session?.user?.uuid}`);
                    }}
                    disabled={loading}
                  >
                    {loading ? "loading.." : "Short a link"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center"></CardFooter>
        </Card>
      </div>
      {process.env.DOMAIN as string}
      <div className="flex justify-center pt-5">
        <div className="w-[40%]">
          <DataTable columns={columns} data={dataLink} />
        </div>
      </div>
    </div>
  );
}
