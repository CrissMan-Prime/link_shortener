import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  function Timeout() {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }

  useEffect(() => {
    Timeout();
  }, []);

  if (loading) {
    return (
      <div className=" flex flex-row basis-1/11 justify-start h-[80px] items-center pr-5">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex">
        <Link href={"/register"} className="flex justify-center px-3">
          SignIn
        </Link>
        <Link href={"/login"} className="flex justify-center">
          Login
        </Link>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={`${session?.user.image}`} />
          <AvatarFallback>SH</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col items-center text-center w-[16rem] pb-2"
      >
        <div className="pt-2">
          {session?.user.firstName} {session?.user.name}
        </div>
        <div>{session.user.email}</div>
        <DropdownMenuSeparator className="w-full" />
        {session.user.role == "Owner_shorta" ? (
          <Link href="/admin/dashboard" className="w-full bg-black+">
          Dashboard
          </Link>
        ) : null}
        <DropdownMenuItem className="w-full flex justify-center" onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
