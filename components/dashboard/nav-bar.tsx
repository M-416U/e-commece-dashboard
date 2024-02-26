import { UserButton, auth } from "@clerk/nextjs";

import StoreSwitcher from "@/components/dashboard/store-switcher";
import MainNav from "@/components/dashboard/main-nav";
import prismaDB from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const stores = await prismaDB.store.findMany({ where: { userID: userId } });
  return (
    <nav className="flex justify-between h-16 border-b items-center px-8">
      <div className="flex gap-3 items-center">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
      </div>
      <div className="flex gap-2 items-center">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;
