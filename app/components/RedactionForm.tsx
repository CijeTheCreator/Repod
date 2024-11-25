/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "@/components/ui/form";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { formattedPoliciesNotReadonly, policies } from "@/Policies";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RedactionFormSchema, TRedactionForm } from "@/lib/types";

interface RedactionFormProps {
  isHidden: boolean;
  setCurrentFormAction: React.Dispatch<React.SetStateAction<number>>;
  finalSubmitAction: () => void;
}

export function RedactionForm({
  isHidden: isVisible,
  setCurrentFormAction,
  setRedactionFormStateAction,
  finalSubmitAction,
}: RedactionFormProps & {
  setRedactionFormStateAction: React.Dispatch<
    React.SetStateAction<TRedactionForm | null>
  >;
}) {
  const [disableForm, setDisableForm] = useState(false);
  const form = useForm<TRedactionForm>({
    resolver: zodResolver(RedactionFormSchema),
  });
  const router = useRouter();

  function onSubmit(_data: TRedactionForm) {
    setRedactionFormStateAction(_data);
    finalSubmitAction();
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
          <Button type="submit">Submit</Button>
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
