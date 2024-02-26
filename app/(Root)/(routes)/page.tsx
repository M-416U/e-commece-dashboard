"use client";
import { useEffect } from "react";

import { UserButton } from "@clerk/nextjs";
import { useDialogModel } from "@/hooks/use-dialogModel";
export default function Home() {
  const isOpen = useDialogModel((state) => state.isOpen);
  const onOpen = useDialogModel((state) => state.onOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);
  return (
    <>
      <UserButton afterSignOutUrl="/" />
    </>
  );
}
