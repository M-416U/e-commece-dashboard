"use client";

type ErrorType = {
  message: string;
};
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
import { Billboard } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DeleteAlert from "@/components/dashboard/settings/delete-alert";
import toast from "react-hot-toast";
import Heading from "@/components/ui/heading";
import { Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import UploadImage from "@/components/ui/upload-image";

type BillBoardFormType = {
  initialData: Billboard | null;
};

const BillBoardForm = ({ initialData }: BillBoardFormType) => {
  const params = useParams();
  const router = useRouter();
  const [isload, setIsload] = useState(false);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const title = initialData ? "Edit BillBoard" : "Create BillBoard";
  const desc = initialData
    ? "Add a BillBoard For Your Store"
    : "Create a BillBoard For Your Store";
  const action = initialData ? "Save Changes" : "Create";

  const onSubmit = async (data: { label: string }) => {
    try {
      setIsload(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
        toast.success(`${res.data.message}`);
      } else {
        const res = await axios.post(`/api/${params.storeId}/billboards`, data);
        console.log(res);
        toast.success(`${res.data.message}`);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error: any) {
      setIsload(false);
      toast.error(`Error:${error.message}`);
    } finally {
      setIsload(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsload(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      toast.success("Billboard deleted successfully");
      router.push(`/${params.storeId}/billboards`);
    } catch (error: any) {
      toast.error("Make Sure You Deleted All Categories use This Billboard");
    } finally {
      setIsload(false);
      router.refresh();
    }
  };
  return (
    <>
      <DeleteAlert
        isLoad={isload}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex justify-between py-3">
        <Heading title={title} description={desc} />
        {initialData && (
          <Button
            size="icon"
            variant="destructiveOutline"
            onClick={() => setOpen(true)}
          >
            <Trash2Icon />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <UploadImage
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    disabled={isload}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isload}
                      placeholder="Type Billboard Label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isload}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillBoardForm;
