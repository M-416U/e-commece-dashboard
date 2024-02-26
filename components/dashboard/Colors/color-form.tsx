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
import { Size } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DeleteAlert from "@/components/dashboard/settings/delete-alert";
import toast from "react-hot-toast";
import Heading from "@/components/ui/heading";
import { Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ColorFormType = {
  initialData: Size | null;
};

const ColorForm = ({ initialData }: ColorFormType) => {
  const params = useParams();
  const router = useRouter();
  const [isload, setIsload] = useState(false);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "#000000",
    },
  });

  const title = initialData ? "Edit Color" : "Create Color";
  const desc = initialData
    ? "Add a Color For Your Store"
    : "Create a Color For Your Store";
  const action = initialData ? "Save Changes" : "Create";

  const onSubmit = async (data: { name: string; value: string }) => {
    try {
      setIsload(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
        toast.success(`${res.data.message}`);
      } else {
        const res = await axios.post(`/api/${params.storeId}/colors`, data);
        console.log(res);
        toast.success(`${res.data.message}`);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      toast.success("Color deleted successfully");
      router.push(`/${params.storeId}/colors`);
    } catch (error: any) {
      toast.error(`Error:${error.message}`);
    } finally {
      setOpen(false);
      setIsload(false);
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
                      placeholder="Type Color Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isload}
                      placeholder="Set Color Value"
                      type="color"
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

export default ColorForm;
