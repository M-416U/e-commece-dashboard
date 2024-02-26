import SettingsForm from "@/components/dashboard/settings/settings-form";
import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type SettingsPageType = {
  params: {
    storeId: string;
  };
};

const SettingsPage = async ({ params }: SettingsPageType) => {
  const { userId } = auth();
  const storeId = params.storeId;
  if (!userId) redirect("/sign-in");

  const store = await prismaDB.store.findFirst({
    where: {
      id: storeId,
      userID: userId,
    },
  });

  if (!store) redirect("/");
  return (
    <div className="px-8 py-6">
      <SettingsForm initialData={store} />
    </div>
  );
};

export default SettingsPage;
