import { auth } from "@/lib/auth";

import ProductPage from "./components/pages/ProductsPage";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-600 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-start min-h-screen py-12">
          <div className=" bg-white p-2 rounded-lg mt-2 w-full">
            <ProductPage />
          </div>
        </div>
      </div>
    </main>
  );
}
