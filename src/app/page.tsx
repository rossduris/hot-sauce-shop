import { auth } from "@/lib/auth";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { User } from "lucide-react";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ADMIN
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <LogoutButton />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Welcome to Our Platform
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-500">
                Get started by signing in with your account
              </p>
              <div className="mt-8">
                <LoginButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
