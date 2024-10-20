import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface JsonFormField {
  fieldType?: string;
  placeholder?: string;
  fieldName?: string;
  formLabel?: string;
  selectOptions?: { label: string; value: string }[];
  radioOptions?: { label: string; value: string }[];
  checkboxOptions?: { label: string; value: string }[];
}

interface JsonForm {
  formTitle?: string;
  formSubheading?: string;
  formFields?: JsonFormField[];
}

interface ReadOnlyFormUiProps {
  jsonForm?: JsonForm;
  onInputChange: (fieldName: string, value: string) => void;
}

const ReadOnlyFormUi: React.FC<ReadOnlyFormUiProps> = ({ jsonForm, onInputChange }) => {
  return (
    <div className="border p-5 rounded-md">
      <div className="mb-4">
        <h1 className="font-bold text-center text-2xl">{jsonForm?.formTitle || "Untitled Form"}</h1>
      </div>
      <div className="mb-4">
        <h2 className="text-center text-xl">{jsonForm?.formSubheading || "No subheading provided"}</h2>
      </div>
      {jsonForm?.formFields?.map((formField, index) => (
        <div key={index} className="my-4">
          <Label>{formField?.formLabel || `Field ${index + 1}`}</Label>

          {formField?.fieldType === "select" && formField?.selectOptions ? (
            <Select onValueChange={(value) => onInputChange(formField.fieldName || `field-${index}`, value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={formField.placeholder || "Select"} />
              </SelectTrigger>
              <SelectContent>
                {formField.selectOptions.map((option, idx) => (
                  <SelectItem key={idx} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : formField?.fieldType === "radio" && formField?.radioOptions ? (
            <RadioGroup onValueChange={(value) => onInputChange(formField.fieldName || `field-${index}`, value)}>
              {formField.radioOptions.map((radioOption, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={radioOption.value}
                    id={`radio-${index}-${idx}`}
                  />
                  <Label htmlFor={`radio-${index}-${idx}`}>
                    {radioOption.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : formField?.fieldType === "checkbox" && formField?.checkboxOptions ? (
            <div>
              {formField.checkboxOptions.map((checkboxOption, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`checkbox-${index}-${idx}`}
                    onCheckedChange={(checked) => 
                      onInputChange(formField.fieldName || `field-${index}`, checked ? checkboxOption.value : '')
                    }
                  />
                  <Label htmlFor={`checkbox-${index}-${idx}`}>
                    {checkboxOption.label}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <Input
              type={formField?.fieldType || "text"}
              placeholder={formField?.placeholder || ""}
              name={formField?.fieldName || `field-${index}`}
              onChange={(e) => onInputChange(formField.fieldName || `field-${index}`, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ReadOnlyFormUi;