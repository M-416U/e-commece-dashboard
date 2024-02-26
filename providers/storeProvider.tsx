"use client";

import NewStoreModel from "@/components/models/newStoreModel";
import { useEffect, useState } from "react";

const StoreProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return <NewStoreModel />;
};

export default StoreProvider;
