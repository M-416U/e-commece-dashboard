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
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DeleteAlert from "@/components/dashboard/settings/delete-alert";
import toast from "react-hot-toast";
import Heading from "@/components/ui/heading";
import { Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryType = {
  initialData: Category | null;
  billboards: Billboard[];
};

const CategoryForm = ({ initialData, billboards }: CategoryType) => {
  const params = useParams();
  const router = useRouter();
  const [isload, setIsload] = useState(false);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const title = initialData ? "Edit Category" : "Create Category";
  const desc = initialData
    ? "Add a Category For Your Store"
    : "Create a Category For Your Store";
  const action = initialData ? "Save Changes" : "Create";

  const onSubmit = async (data: { name: string; billboardId: string }) => {
    try {
      setIsload(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
        toast.success(`${res.data.message}`);
      } else {
        const res = await axios.post(`/api/${params.storeId}/categories`, data);
        toast.success(`${res.data.message}`);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      toast.success("Category deleted successfully");
      router.push(`/${params.storeId}/categories`);
    } catch (error: any) {
      toast.error(`Error:${error.message}`);
    } finally {
      setIsload(false);
      router.refresh();
    }
  };
  return (
    <>
      <DeleteAlert
        title="Delete Category"
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
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isload}
                      placeholder="Type Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isload}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
