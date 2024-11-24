/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Disable } from "react-disable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formattedPoliciesNotReadonly, policies } from "@/Policies";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadFormProps } from "./FileUploadForm";
import { delay } from "@/lib/presenter";

const FormSchema = z.object({
  redact_transcript: z.boolean().default(false).optional(),
  account_number: z.boolean().default(false).optional(),
  banking_information: z.boolean().default(false).optional(),
  blood_type: z.boolean().default(false).optional(),
  credit_card_cvv: z.boolean().default(false).optional(),
  credit_card_expiration: z.boolean().default(false).optional(),
  credit_card_number: z.boolean().default(false).optional(),
  date: z.boolean().default(false).optional(),
  date_of_birth: z.boolean().default(false).optional(),
  drivers_license: z.boolean().default(false).optional(),
  drug: z.boolean().default(false).optional(),
  email_address: z.boolean().default(false).optional(),
  event: z.boolean().default(false).optional(),
  gender_sexuality: z.boolean().default(false).optional(),
  healthcare_number: z.boolean().default(false).optional(),
  injury: z.boolean().default(false).optional(),
  ip_address: z.boolean().default(false).optional(),
  language: z.boolean().default(false).optional(),
  location: z.boolean().default(false).optional(),
  medical_condition: z.boolean().default(false).optional(),
  medical_process: z.boolean().default(false).optional(),
  money_amount: z.boolean().default(false).optional(),
  nationality: z.boolean().default(false).optional(),
  number_sequence: z.boolean().default(false).optional(),
  occupation: z.boolean().default(false).optional(),
  organization: z.boolean().default(false).optional(),
  passport_number: z.boolean().default(false).optional(),
  password: z.boolean().default(false).optional(),
  person_age: z.boolean().default(false).optional(),
  person_name: z.boolean().default(false).optional(),
  phone_number: z.boolean().default(false).optional(),
  political_affiliation: z.boolean().default(false).optional(),
  religion: z.boolean().default(false).optional(),
  url: z.boolean().default(false).optional(),
  us_social_security_number: z.boolean().default(false).optional(),
  username: z.boolean().default(false).optional(),
  vehicle_id: z.boolean().default(false).optional(),
});

interface RedactionFormProps {
  isHidden: boolean;
  setCurrentFormAction: React.Dispatch<React.SetStateAction<number>>;
}

export function RedactionForm({
  isHidden: isVisible,
  setCurrentFormAction,
}: RedactionFormProps) {
  const [disableForm, setDisableForm] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();

  function onSubmit(_data: z.infer<typeof FormSchema>) {
    // toast.success("Details Saved Successfully");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 w-full ${isVisible ? "" : "hidden"}`}
      >
        <FormField
          control={form.control}
          name="redact_transcript"
          render={({ field }) => {
            const fieldValue = field.value ? field.value : false;
            setDisableForm(fieldValue);
            return (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Redact Personal Information
                  </FormLabel>
                  <FormDescription>
                    Minimize sensitive information about individuals by
                    automatically identifying and removing it from your
                    transcript.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    className="mx-2"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Disable disabled={!disableForm}>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {policies.map((value, index) => (
              <FormField
                key={index}
                control={form.control}
                name={value}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {formattedPoliciesNotReadonly[index]}
                      </FormLabel>
                      <FormDescription> </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </ScrollArea>
        </Disable>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              const toastId = toast.loading("Transcribing podcast", {
                description: "The Joe Rogan Experience 2",
                cancel: {
                  label: "Cancel",
                  onClick: () => toast.dismiss(toastId),
                },
              });
              await delay(14000);
              toast.dismiss(toastId);
              toast.success("The Joe Rogan Experience 2 created");
              router.push("/podcasts");
            }}
            type="submit"
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              setCurrentFormAction(2);
            }}
            variant={"secondary"}
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
}
