"use client";

import { Button } from "@/components/ui/button";
import { CategoryColumn } from "./columns";
import { Copy, Edit, TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
  data: CategoryColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Category Id copied to the clipboard.");
  };
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      router.refresh();
      toast.success("Category successfully deleted.");
    } catch (error) {
      toast.error("Make sure you removed all product using this category.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" /> Copy Category Id
          </Button>
          <Button
            variant="default"
            onClick={() =>
              router.push(`/${params.storeId}/categories/${data.id}`)
            }
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            <TrashIcon className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
    </>
  );
};

export default CellAction;
