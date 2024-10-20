import React from "react";
import CopyBtn from "@/components/copy-btn";

interface EmbedAiFormProps {
  params: {
    formId?: string;
  };
}

const EmbedAiForm: React.FC<EmbedAiFormProps> = ({ params }) => {
  if (!params.formId) return <div>Invalid Form ID</div>;
  if (!process.env.NEXT_PUBLIC_WIDGET_URL) return <div>Missing NEXT_PUBLIC_WIDGET_URL</div>;

  const embedCode = `<ai-form form-id="${params.formId}"></ai-form>\n<script src="${process.env.NEXT_PUBLIC_WIDGET_URL}/ai-form-widget.js"></script>`;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Embed Your AI Form</h1>
      <p className="text-lg text-secondary-foreground">
        Copy and paste this code to embed the AI form in your website
      </p>
      <div className="bg-blue-950 p-6 rounded-md mt-6 relative">
        <code className="text-white">
          {embedCode}
        </code>
        <CopyBtn text={embedCode} />
      </div>
    </div>
  );
};

export default EmbedAiForm;