"use client";

type ErrorType = {
  message: string;
};
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import DeleteAlert from "@/components/dashboard/settings/delete-alert";
import toast from "react-hot-toast";
import Heading from "@/components/ui/heading";
import { Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import UploadImage from "@/components/ui/upload-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ProductFormType = {
  initialData:
    | (Product & {
        Images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductFormType) => {
  const params = useParams();
  const router = useRouter();
  const [isload, setIsload] = useState(false);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    images: z.object({ url: z.string() }).array(),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    categoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData.price)) }
      : {
          name: "",
          images: [],
          colorId: "",
          price: 0.0,
          sizeId: "",
          categoryId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const title = initialData ? "Edit Product" : "Create Product";
  const desc = initialData
    ? "Add a Product For Your Store"
    : "Create a Product For Your Store";
  const action = initialData ? "Save Changes" : "Create";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsload(true);
      if (initialData) {
        const res = await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
        toast.success(`${res.data.message}`);
      } else {
        const res = await axios.post(`/api/${params.storeId}/products`, data);

        toast.success(`${res.data.message}`);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("product deleted successfully");
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
      toast.error("Something went wrong");
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <UploadImage
                    value={field.value.map((img) => img.url)}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((img) => img.url !== url),
                      ])
                    }
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isload}
                      placeholder="Type Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isload}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                          placeholder="Select a Size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder="Select a Color"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        // @ts-ignore
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>is Featured</FormLabel>
                      <FormDescription>
                        This Make This Product appear on Store Home Page
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        // @ts-ignore
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>is Archived</FormLabel>
                      <FormDescription>
                        This Make This Product not appear anywhere
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </div>
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

export default ProductForm;
