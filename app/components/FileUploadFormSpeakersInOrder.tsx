/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Disable } from "react-disable";

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
import { UploadFormProps } from "./FileUploadForm";
import { SpeakersFormSchema, TSpeakersForm } from "@/lib/types";

export function SpeakersForm({
  isHidden: isVisible,
  setCurrentFormAction,
  setSpeakersFormStateAction,
}: UploadFormProps & {
  setSpeakersFormStateAction: React.Dispatch<
    React.SetStateAction<TSpeakersForm | null>
  >;
}) {
  const [disableForm, setDisableForm] = useState(false);
  const form = useForm<TSpeakersForm>({
    resolver: zodResolver(SpeakersFormSchema),
  });

  function onSubmit(_data: TSpeakersForm) {
    setSpeakersFormStateAction(_data);
    setCurrentFormAction(3);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 w-full ${isVisible ? "" : "hidden"}`}
      >
        <FormField
          control={form.control}
          name="identify_speakers"
          render={({ field }) => {
            const fieldValue = field.value ? field.value : false;
            setDisableForm(fieldValue);
            return (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Identify Speakers</FormLabel>
                  <FormDescription>
                    Identify speakers in during playback with a cool animation
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
          <FormField
            control={form.control}
            name="speakers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speakers</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A comma separated list of speakers in order"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can mention upto 20 speakers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Disable>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setCurrentFormAction(3);
            }}
            type="submit"
          >
            Next
          </Button>
          <Button
            onClick={() => {
              setCurrentFormAction(1);
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
