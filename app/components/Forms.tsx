import * as React from "react";

import { FileUploadForm } from "./FileUploadForm";
import { SpeakersForm } from "./FileUploadFormSpeakersInOrder";
import { RedactionForm } from "./RedactionForm";
import { TBasicDetailsForm, TRedactionForm, TSpeakersForm } from "@/lib/types";

interface FormProps {
  currentForm: number;
  setCurrentForm: React.Dispatch<React.SetStateAction<number>>;
  setBasicDetailsFormStateAction: React.Dispatch<
    React.SetStateAction<TBasicDetailsForm | null>
  >;
  setRedactionFormStateAction: React.Dispatch<
    React.SetStateAction<TRedactionForm | null>
  >;
  setSpeakersFormStateAction: React.Dispatch<
    React.SetStateAction<TSpeakersForm | null>
  >;
  submitForm: () => void;
}

export function Forms({
  currentForm,
  setCurrentForm,
  setBasicDetailsFormStateAction,
  setRedactionFormStateAction,
  setSpeakersFormStateAction,
  submitForm,
}: FormProps) {
  return (
    <>
      <FileUploadForm
        isHidden={currentForm == 1}
        setCurrentFormAction={setCurrentForm}
        setBasicDetailsFormStateAction={setBasicDetailsFormStateAction}
      />
      <SpeakersForm
        isHidden={currentForm == 2}
        setCurrentFormAction={setCurrentForm}
        setSpeakersFormStateAction={setSpeakersFormStateAction}
      />
      <RedactionForm
        isHidden={currentForm == 3}
        setCurrentFormAction={setCurrentForm}
        finalSubmitAction={submitForm}
        setRedactionFormStateAction={setRedactionFormStateAction}
      />
    </>
  );
}
