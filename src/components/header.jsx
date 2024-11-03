"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession, signOut } from "next-auth/react";
function Header() {
  const { data: session } = useSession();
  // console.log(session);
  return (
    <header className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href={"/"}>
          <Image
            className="lg:hidden"
            src="/logo.webp"
            width={40}
            height={40}
            alt="insta logo"
          />
          <Image
            className="hidden lg:inline-flex"
            src="/logo_black.webp"
            width={96}
            height={96}
            alt="insta logo"
          />
        </Link>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />
        {session ? (
          <img
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={signOut}
            src={session.user.image}
            // width={40}
            // height={40}
            alt={session.user.name}
          />
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm font-semibold text-blue-500"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
