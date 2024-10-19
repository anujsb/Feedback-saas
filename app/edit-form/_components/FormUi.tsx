// import { Input } from "@/components/ui/input";
// import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
// import FieldEdit from "./FieldEdit";

// interface JsonFormField {
//   fieldType?: string;
//   placeholder?: string;
//   fieldName?: string;
//   formLabel?: string;
//   selectOptions?: { label: string; value: string }[]; // Options for select dropdowns
//   radioOptions?: { label: string; value: string }[]; // Options for radio buttons
//   checkboxOptions?: { label: string; value: string }[]; // Options for checkboxes
// }

// interface JsonForm {
//   formTitle?: string;
//   formSubheading?: string;
//   formFields?: JsonFormField[];
// }

// interface FormUiProps {
//   jsonForm?: JsonForm;
//   onFieldUpdate: (updatedField: Partial<JsonFormField>, index: number) => void;
// }

// const FormUi: React.FC<FormUiProps> = ({ jsonForm, onFieldUpdate }) => {
//   const handleUpdate = (index: number, updatedField: Partial<JsonFormField>) => {
//     onFieldUpdate(updatedField, index);
//   };

//   return (
//     <div className="border p-5 rounded-md">
//       <h1 className="font-bold text-center text-2xl">
//         {jsonForm?.formTitle || "Untitled Form"}
//       </h1>
//       <h2 className="text-center text-xl">
//         {jsonForm?.formSubheading || "No heading provided"}
//       </h2>
//       {jsonForm?.formFields?.map((formField, index) => (
//         <div key={index} className="my-4">
//           <div className="flex justify-between">
//             <label>{formField?.formLabel || `Field ${index + 1}`}</label>
//             <FieldEdit
//               defaultValue={formField}
//               onUpdate={(updatedField) => handleUpdate(index, updatedField)}
//             />
//           </div>

//           {formField?.fieldType === "select" && formField?.selectOptions ? (
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder={formField.placeholder || "Select"} />
//               </SelectTrigger>
//               <SelectContent>
//                 {formField.selectOptions.map((option, idx) => (
//                   <SelectItem key={idx} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ) : formField?.fieldType === "radio" && formField?.radioOptions ? (
//             <RadioGroup defaultValue={formField.radioOptions[0]?.value || ""}>
//               {formField.radioOptions.map((radioOption, idx) => (
//                 <div key={idx} className="flex items-center space-x-2">
//                   <RadioGroupItem
//                     value={radioOption.value}
//                     id={`radio-${index}-${idx}`}
//                   />
//                   <Label htmlFor={`radio-${index}-${idx}`}>
//                     {radioOption.label}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           ) : formField?.fieldType === "checkbox" &&
//             formField?.checkboxOptions ? (
//             <div>
//               {formField.checkboxOptions.map((checkboxOption, idx) => (
//                 <div key={idx} className="flex items-center space-x-2">
//                   <Checkbox id={`checkbox-${index}-${idx}`} />
//                   <Label htmlFor={`checkbox-${index}-${idx}`}>
//                     {checkboxOption.label}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <Input
//               type={formField?.fieldType || "text"}
//               placeholder={formField?.placeholder || ""}
//               name={formField?.fieldName || `field-${index}`}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FormUi;


import { Input } from "@/components/ui/input";
import React from "react";
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
import FieldEdit from "./FieldEdit";

interface JsonFormField {
  fieldType?: string;
  placeholder?: string;
  fieldName?: string;
  formLabel?: string;
  selectOptions?: { label: string; value: string }[]; // Options for select dropdowns
  radioOptions?: { label: string; value: string }[]; // Options for radio buttons
  checkboxOptions?: { label: string; value: string }[]; // Options for checkboxes
}

interface JsonForm {
  formTitle?: string;
  formSubheading?: string;
  formFields?: JsonFormField[];
}

interface FormUiProps {
  jsonForm?: JsonForm;
  onFieldUpdate: (updatedField: Partial<JsonFormField>, index: number) => void;
}

const FormUi: React.FC<FormUiProps> = ({ jsonForm, onFieldUpdate }) => {
  const handleUpdate = (index: number, updatedField: Partial<JsonFormField>) => {
    onFieldUpdate(updatedField, index);
  };

  return (
    <div className="border p-5 rounded-md">
      <h1 className="font-bold text-center text-2xl">
        {jsonForm?.formTitle || "Untitled Form"}
      </h1>
      <h2 className="text-center text-xl">
        {jsonForm?.formSubheading || "No heading provided"}
      </h2>
      {jsonForm?.formFields?.map((formField, index) => (
        <div key={index} className="my-4">
          <div className="flex justify-between">
            <label>{formField?.formLabel || `Field ${index + 1}`}</label>
            <FieldEdit
              defaultValue={formField}
              onUpdate={(updatedField) => handleUpdate(index, updatedField)}
            />
          </div>

          {formField?.fieldType === "select" && formField?.selectOptions ? (
            <Select>
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
            <RadioGroup defaultValue={formField.radioOptions[0]?.value || ""}>
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
          ) : formField?.fieldType === "checkbox" &&
            formField?.checkboxOptions ? (
            <div>
              {formField.checkboxOptions.map((checkboxOption, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox id={`checkbox-${index}-${idx}`} />
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
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FormUi;