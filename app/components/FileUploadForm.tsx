/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BasicDetailsFormSchema, TBasicDetailsForm } from "@/lib/types";

export interface UploadFormProps {
  isHidden: boolean;
  setCurrentFormAction: React.Dispatch<React.SetStateAction<number>>;
}
export function FileUploadForm({
  isHidden: isVisible,
  setCurrentFormAction,
  setBasicDetailsFormStateAction,
}: UploadFormProps & {
  setBasicDetailsFormStateAction: React.Dispatch<
    React.SetStateAction<TBasicDetailsForm | null>
  >;
}) {
  const form = useForm<TBasicDetailsForm>({
    resolver: zodResolver(BasicDetailsFormSchema),
    defaultValues: {
      podcastTitle: "",
    },
  });

  function onSubmit(data: TBasicDetailsForm) {
    setBasicDetailsFormStateAction(data);
    setCurrentFormAction(2);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 ${isVisible ? "" : "hidden"}`}
      >
        <FormField
          control={form.control}
          name="podcastTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Podcast Title</FormLabel>
              <FormControl>
                <Input placeholder="The AssemblyAI show" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="picture"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Display Picture</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Picture"
                  type="file"
                  accept="image/*, application/pdf"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="filter_profanity"
          render={({ field }) => {
            const fieldValue = field.value ? field.value : false;
            return (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Filter Profanity</FormLabel>
                  <FormDescription>
                    Automatically detect and remove offensive language to ensure
                    your transcript remains respectful and appropriate.
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
        <div className="flex gap-2">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
