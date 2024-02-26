import { Button } from "@/components/ui/button";
import { Category } from "./columns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit3, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import DeleteAlert from "../settings/delete-alert";

const CategoryActions = ({ data }: { data: Category }) => {
  const [isload, setIsload] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("id copied");
  };

  const onDelete = async () => {
    try {
      setIsload(true);
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      toast.success("Categories deleted successfully");
      router.refresh();
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
        title={`Delete "${data.name}" `}
        isLoad={isload}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isload}>
          <Button variant="outline">
            <span className="sr-only">Open</span>
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>ACTIONS</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/categories/${data.id}`)
            }
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Edit {data.name}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="w-5 h-5 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-5 h-5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CategoryActions;
