"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Store } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DeleteAlert from "./delete-alert";
import toast from "react-hot-toast";
import Heading from "@/components/ui/heading";
import { Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type SettingsFormType = {
  initialData: Store;
};

const SettingsForm = ({ initialData }: SettingsFormType) => {
  const params = useParams();
  const router = useRouter();
  const [isload, setIsload] = useState(false);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({ name: z.string().min(1) });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const onSubmit = async (data: { name: string }) => {
    try {
      setIsload(true);
      await axios.patch(`/api/Stores/${params.storeId}`, data);
      toast.success("Updated successfully");
      router.refresh();
    } catch (error) {
      setIsload(false);
      toast.error("Failed to update");
    } finally {
      setIsload(false);
    }
  };

  const deleteStore = async () => {
    try {
      setIsload(true);
      await axios.delete(`/api/Stores/${params.storeId}`);
      toast.success("Stores deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Make Sure You deleted All Products First");
    } finally {
      setIsload(false);
    }
  };
  return (
    <>
      <DeleteAlert
        title={`Delete "${initialData.name}" `}
        isLoad={isload}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
      />
      <div className="flex justify-between py-3">
        <Heading title="Settings" description="manage Your store" />
        <Button
          size="icon"
          variant="destructiveOutline"
          onClick={() => setOpen(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isload}
                      placeholder="Type Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isload}>
            Save Changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
