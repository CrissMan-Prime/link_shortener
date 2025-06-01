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
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ShortenerSchema, ShortenerUpdateSchema } from "@/schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export default function Client() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [dataLink, setDataLink] = useState<
    {
      original: string;
      shorta: string;
      owner: string;
      uuid: string;
    }[]
  >([]);

  const form = useForm<z.infer<typeof ShortenerSchema>>({
    resolver: zodResolver(ShortenerSchema),
    defaultValues: {
      author: "",
      original: "",
    },
  });
  const formUpdate = useForm<z.infer<typeof ShortenerUpdateSchema>>({
    resolver: zodResolver(ShortenerUpdateSchema),
    defaultValues: {
      owner: "",
      uuid: "",
      original: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ShortenerSchema>) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin", {
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
  const onUpdateSubmit = async (
    data: z.infer<typeof ShortenerUpdateSchema>
  ) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const message = (await response.json()).message as string;

      if (response.status >= 300 && response.status <= 599) {
        setLoading(false);
        toast.error("Error ", {
          description: `${message}`,
        });
        return null;
      }
      setLoading(false);
      toast.success("Success ", {
        description: `${message}`,
      });
    } catch (err) {
      toast.error("Internal Error", {
        description: `${err}`,
      });
    }
  };

  const onDelete = async (
    data: z.infer<typeof ShortenerUpdateSchema>
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      const message = (await response.json()).message as string;

      if (response.status >= 300 && response.status <= 599) {
        setLoading(false);
        toast.error("Error", {
          description: `${message}`,
        });
        return null;
      }

      setLoading(false);
      toast.success("Success", {
        description: `${message}`,
      });
    } catch (err) {
      setLoading(false);
      toast.error("Internal Error", {
        description: `${err}`,
      });
    }
  };

  async function fetchLink() {
    const res = await fetch("/api/admin", {
      method: "GET",
    });
    const data = await res.json();
    setDataLink(data);
  }
  useEffect(() => {
    fetchLink();
  }, [loading]);

  const columns: ColumnDef<{
    original: string;
    shorta: string;
    owner: string;
    uuid: string;
  }>[] = [
       {
        accessorKey: "uuid",
        header: () => <p className="text-start">UUID</p>,
        cell: ({ row }) => {
          const original = String(row.getValue("uuid"));
          return (
            <div className={`flex truncate max-w-60`}>
              <div
                className=""
                onClick={() => {
                  navigator.clipboard.writeText(original);
                  toast.success("Success ", {
                    description: `the UUID has been copied `,
                  });
                }}
              >
                {original}
              </div>
            </div>
          );
        },
      },
       {
        accessorKey: "owner",
        header: () => <p className="text-start">Owner</p>,
        cell: ({ row }) => {
          const original = String(row.getValue("owner"));
          return (
            <div className={`flex truncate max-w-60`}>
              <div
                className=""
                onClick={() => {
                  navigator.clipboard.writeText(original);
                  toast.success("Success ", {
                    description: `the UUID Owner has been copied `,
                  });
                }}
              >
                {original}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "shorta",
        header: "Shorta",
        cell: ({ row }) => {
          const names = String(row.getValue("shorta"));
          const link = `${process.env.NEXT_PUBLIC_DOMAIN}/${names}`;
          return (
            <div className={`flex truncate max-w-60`}>
              <div
                className=""
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast.success("Success ", {
                    description:
                      `the link has been copied ` +
                      `${process.env.NEXT_PUBLIC_DOMAIN}/${names}`,
                  });
                }}
              >
                {link}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "original",
        header: () => <p className="text-start">Original</p>,
        cell: ({ row }) => {
          const original = String(row.getValue("original"));
          return (
            <div className={`flex truncate max-w-60`}>
              <div
                className=""
                onClick={() => {
                  navigator.clipboard.writeText(original);
                  toast.success("Success ", {
                    description: `the link has been copied `,
                  });
                }}
              >
                {original}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "menu",
        header: () => null,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {" "}
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {update == false ? (
                  <DropdownMenuItem
                    className="p-2 flex justify-center text-center items-center"
                    onClick={() => {
                      setUpdate(true);
                      formUpdate.setValue("original", row.getValue("original"));
                      formUpdate.setValue("owner", row.getValue("owner"));
                      formUpdate.setValue("uuid", row.getValue("uuid"));
                    }}
                  >
                    Update
                  </DropdownMenuItem>
                ) : null}
                <AlertDialog>
                  <AlertDialogTrigger className="w-full">
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-border bg-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        your link and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        formUpdate.setValue("owner", row.getValue("owner"))
                        formUpdate.setValue("uuid", row.getValue("uuid"))
                        onDelete(formUpdate.getValues())
                      }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];

  return (
    <div>
      <div className="flex h-full justify-center pt-10">
        <Card className="lg:w-[60%] xl:w-[27%]">
          <CardHeader className=" text-center">
            <CardTitle className="text-5xl pt-5">Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex w-full justify-center">
            <div className="w-[90%]">
              {update == false ? (
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
              ) : (
                <Form {...formUpdate}>
                  <form
                    onSubmit={formUpdate.handleSubmit(onUpdateSubmit)}
                    className="flex flex-col gap-5"
                  >
                    <FormField
                      control={formUpdate.control}
                      name="original"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder=" insert your link"
                              defaultValue={formUpdate.getValues("original")}
                              onChange={(e) => {
                                formUpdate.setValue("original", e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row">
                      <div className="w-full px-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "loading.." : "Create Permission"}
                        </Button>
                      </div>
                      <Button
                        className="w-[150px]"
                        disabled={loading}
                        onClick={() => {
                          setUpdate(false);
                        }}
                      >
                        {loading ? "loading.." : "Cancel"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center" />
        </Card>
      </div>
      <div className="flex justify-center pt-5">
        <div className="w-[80%]">
          <DataTable columns={columns} data={dataLink} />
        </div>
      </div>
    </div>
  );
}
