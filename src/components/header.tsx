import { useUserStore } from "@/zustand/user-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiCartAlt } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Button, buttonVariants } from "./ui/button";
import { useCartStore } from "@/zustand/cart-store";
import UserAvatar from "./user-avatar";

export function Header() {
  const router = useRouter();

  const links = [
    {
      name: "Store",
      link: "/",
    },
    // {
    //   name: "Orders",
    //   link: "/orders",
    // },
  ];

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

      {/* <ul className="flex justify-center items-center list-none space-x-4">
        {links.map((link: any, index: number) => (
          <li key={index}>
            <Link
              href={link.link}
              className="text-sm tracking-tight hover:text-red-500  cursor-pointer transition-all duration-200"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul> */}

      <div className="flex justify-end items-center space-x-2">
        <button onClick={goToCart} className="relative inline-block">
          <Button
            variant={"outline"}
            className="h-10 w-10 flex justify-center text-2xl items-center  rounded-md hover:text-red-500 cursor-pointer transition-all duration-200"
          >
            <BiCartAlt />
          </Button>
          <div className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {cartItems.length}
          </div>
        </button>

        <UserAvatar />
      </div>
    </nav>
  );
}
