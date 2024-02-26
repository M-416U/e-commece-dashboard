import { Button } from "@/components/ui/button";
import { ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
type UploadImageTypes = {
  value: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

const UploadImage = ({
  value,
  disabled,
  onChange,
  onRemove,
}: UploadImageTypes) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        {value.map((value) => (
          <div
            key={value}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <Button
              onClick={() => onRemove(value)}
              disabled={disabled}
              className="absolute top-1 z-20 right-1"
              variant="destructive"
              size="icon"
            >
              <Trash className="w-4 h-4" />
            </Button>
            <Image src={value} alt="image" fill className="object-cover" />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="r0skuflp" onUpload={onUpload}>
        {({ open }) => {
          const onClick = (e: any) => {
            e.preventDefault();
            open();
          };

          return (
            <Button variant="outline" onClick={onClick}>
              <ImagePlusIcon className="w-5 h-5 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default UploadImage;
