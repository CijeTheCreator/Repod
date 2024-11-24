/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const FormSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  authorName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  filter_profanity: z.boolean().default(false).optional(),
  picture: z
    .any()
    .refine(
      (files) => {
        return Array.from(files).every((file) => file instanceof File);
      },
      { message: "Expected a file" },
    )
    .refine(
      (files: File[]) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type),
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp",
    ),
});

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export interface UploadFormProps {
  isHidden: boolean;
  setCurrentForm: React.Dispatch<React.SetStateAction<number>>;
}
export function FileUploadForm({
  isHidden: isVisible,
  setCurrentForm,
}: UploadFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      podcastTitle: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    ("");
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
          <Button
            type="submit"
            onClick={() => {
              setCurrentForm(2);
            }}
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
