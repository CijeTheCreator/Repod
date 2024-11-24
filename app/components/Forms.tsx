import * as React from "react";

import { FileUploadForm } from "./FileUploadForm";
import { SpeakersForm } from "./FileUploadFormSpeakersInOrder";
import { RedactionForm } from "./RedactionForm";

interface FormProps {
  currentForm: number;
  setCurrentForm: React.Dispatch<React.SetStateAction<number>>;
}
export function Forms({ currentForm, setCurrentForm }: FormProps) {
  return (
    <>
      <FileUploadForm
        isHidden={currentForm == 1}
        setCurrentForm={setCurrentForm}
      />
      <SpeakersForm
        isHidden={currentForm == 2}
        setCurrentForm={setCurrentForm}
      />
      <RedactionForm
        isHidden={currentForm == 3}
        setCurrentFormAction={setCurrentForm}
      />
    </>
  );
}
