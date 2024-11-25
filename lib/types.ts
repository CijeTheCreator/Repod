import { z } from "zod";

export const BasicDetailsFormSchema = z.object({
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
          BasicDetails_ACCEPTED_IMAGE_TYPES.includes(file.type),
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp",
    ),
});

export type TBasicDetailsForm = z.infer<typeof BasicDetailsFormSchema>;

export const BasicDetails_ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const SpeakersFormSchema = z.object({
  identify_speakers: z.boolean().default(false).optional(),
  speakers: z.string(),
});

export type TSpeakersForm = z.infer<typeof SpeakersFormSchema>;

export const RedactionFormSchema = z.object({
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

export type TRedactionForm = z.infer<typeof RedactionFormSchema>;

export type TOverallForm = {
  basic_details: TBasicDetailsForm;
  redaction: TRedactionForm;
  speakers: TSpeakersForm;
};
