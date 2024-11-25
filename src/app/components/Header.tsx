import React from "react";
import ShoppingCart from "./ShoppingCart";
import Link from "next/link";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { User } from "lucide-react";
import ProductList from "../components/ProductList";
import SyncProductsButton from "../components/SyncProductsButton";
import { auth } from "@/lib/auth";

export const Header = async () => {
  const session = await auth();
  return (
    <header className=" w-full flex justify-between">
      <Link href="/" className=" text-3xl m-4">
        HOT SAUCE ROSS
      </Link>
      {session?.user ? (
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back!
              </h2>
              <p className="text-gray-500">
                {session.user.name || session.user.email}
              </p>
              {session.user.role && (
                <>
                  {session.user.email === process.env.ADMIN_EMAIL ? (
                    <SyncProductsButton />
                  ) : (
                    "USER"
                  )}
                </>
              )}
            </div>

            <div className="mt-8">
              <LogoutButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="mt-8">{/* <LoginButton /> */}</div>
        </div>
      )}
      <ShoppingCart />
    </header>
  );
};
