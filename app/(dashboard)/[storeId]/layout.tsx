import Navbar from "@/components/dashboard/nav-bar";
import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type props = {
  params: { storeId: string };
  children: React.ReactNode;
};
export default async function DashboardLayout({ params, children }: props) {
  const { userId } = auth();
  const storeId = params.storeId;
  if (!userId) redirect("/sign-in");
  const store = await prismaDB.store.findFirst({
    where: {
      userID: userId,
      id: storeId,
    },
  });

  if (!store) redirect("/");
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
