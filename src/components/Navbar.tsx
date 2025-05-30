"use client";

import Profile from "./ui/profile";
import { ModeToggle } from "./ui/theme-toggle";
export default function Navbar() {


  return (
    <div className="flex w-full h-full text-2xl px-8">
      <div className="flex items-center w-full">
        <p className="flex-none">Shorta | Link Shortener</p>
      </div>

      <div className="flex items-center w-[100%] "></div>

      <div className="flex items-center justify-end">
        <div className="flex px-5 justify-center">
          <ModeToggle />
        </div>
       <Profile/>
      </div>
    </div>
  );
}
