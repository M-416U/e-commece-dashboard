"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

import { useDialogModel } from "@/hooks/use-dialogModel";
import Dialog_model from "@/components/ui/dialog_model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewStoreModel = () => {
  const useStore = useDialogModel();
  const [isload, setIsload] = useState(false);
  const formSchema = z.object({ name: z.string().min(1) });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsload(true);
      const res = await axios.post("api/Stores", values);
      window.location.assign(`/${res.data.id}`);
      toast.success("Store Created successfully");
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setIsload(false);
    }
  };
  return (
    <Dialog_model
      IsOpen={useStore.isOpen}
      onClose={useStore.onClose}
      title="New Store"
      description="Create a new Store to manage your categories"
    >
      <div>
        <div className="space-y-3 px-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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

              <div className="py-3 flex justify-between">
                <Button
                  disabled={isload}
                  onClick={useStore.onClose}
                  variant="destructiveOutline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isload}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Dialog_model>
  );
};

export default NewStoreModel;
