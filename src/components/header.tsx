"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/user-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiCartAlt } from "react-icons/bi";
import { Button } from "./ui/button";
import { useCartStore } from "@/zustand/cart-store";
import UserAvatar from "./user-avatar";

export function Header() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isAuthenticated, user } = useUserStore();
  const { cartItems } = useCartStore();

  const goToCart = () => {
    if (!isAuthenticated) {
      alert("Login please 🔐 ...");
    }
    router.push(`/profile/${user?.id!}/cart`);
  };

  return (
    <nav className="flex justify-between items-center h-[64px] max-w-screen w-full">
      <Link href={`/`} className="text-base font-bold tracking-tight">
        Store <strong className="text-red-500 font-extrabold">.</strong>
      </Link>

      <div className="flex justify-end items-center space-x-2">
        <div className="relative inline-block">
          <Button
            variant={"outline"}
            onClick={goToCart}
            className="h-12 w-12 flex justify-center items-center rounded-md hover:text-red-500 cursor-pointer transition-all duration-200"
          >
            <BiCartAlt className="text-5xl" />
          </Button>
          {mounted && (
            <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
              {cartItems.length}
            </div>
          )}
        </div>

        {mounted && <UserAvatar />}
      </div>
    </nav>
  );
}
