"use client";

import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CiUser,
  CiShoppingCart,
  CiSaveDown2,
  CiDeliveryTruck,
} from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/zustand/user-store";
import { IoPersonCircle } from "react-icons/io5";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const UserAvatar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  const [loading, setLoading] = React.useState(false);

  const onLogout = async () => {
    try {
      setLoading(true);
      logout();
      successNotification("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      console.error("Logout failed: ", error.message);
      errorNotification(error.message);
    } finally {
      setLoading(false);
    }
  };

  return isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-lg cursor-pointer transition-all duration-300">
          <AvatarImage
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxq2rx8L2_5PTUI7aA57jJ8z_NPecD2tmNWg&s"
            }
          />
          {/* <IoPersonCircle /> */}
          <AvatarFallback>{user?.email}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 my-2 mr-2 rounded-xl overflow-hidden">
        <DropdownMenuLabel>Profile Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href={`/profile/${user?.id!}/orders`}>
          <DropdownMenuItem className="transition-all cursor-pointer duration-300">
            <p>My Orders</p>
            <DropdownMenuShortcut>
              <CiDeliveryTruck />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="transition-all duration-300 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Log out"}
          <DropdownMenuShortcut>
            <IoMdLogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <button
      onClick={() => router.push("/login")}
      className="text-red-500 text-sm transition-all duration-200 hover:text-red-800"
    >
      Sign In
    </button>
  );
};

export default UserAvatar;
