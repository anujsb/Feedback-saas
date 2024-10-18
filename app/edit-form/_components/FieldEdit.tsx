import React, { useState, useEffect } from "react";
import { Delete, Edit } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FieldEditProps {
  defaultValue: {
    formLabel?: string;
    placeholder?: string;
  };
  onUpdate: (updatedField: { formLabel: string; placeholder: string }) => void;
}

const FieldEdit: React.FC<FieldEditProps> = ({ defaultValue, onUpdate }) => {
  const [formLabel, setLabel] = useState(defaultValue.formLabel || "");
  const [placeholder, setPlaceholder] = useState(
    defaultValue.placeholder || ""
  );

  useEffect(() => {
    setLabel(defaultValue.formLabel || "");
    setPlaceholder(defaultValue.placeholder || "");
  }, [defaultValue]);

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger>
          <Edit className="h-5 w-5 text-accent" />
        </PopoverTrigger>
        <PopoverContent>
          <h1>Edit Fields</h1>
          <div>
            <label>Label Name</label>
            <Input
              type="text"
              value={formLabel}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label>Placeholder??</label>
            <Input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>
          <Button
            onClick={() =>
              onUpdate({
                formLabel,
                placeholder,
              })
            }
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>
      <Delete className="h-5 w-5 text-red-500" />
    </div>
  );
};

export default FieldEdit;
