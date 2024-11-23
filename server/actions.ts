"use server";

import { cookies } from "next/headers";
import { pinata } from "./pinata";
import { PrismaClient } from "@prisma/client";
import { Podcast } from "@/app/components/core/Sidebar";
import { Episode } from "@/app/components/core/MediaItem";
import { formatDuration } from "@/lib/presenter";
import { Divisions } from "@/lib/utils";
import axios from "axios";
import { client } from "./assemblyai";
import { TOverallForm } from "@/lib/types";
import { PiiPolicy } from "assemblyai";
import { openai } from "./openai";
import { array } from "zod";
import { arrayBuffer } from "stream/consumers";

const prisma = new PrismaClient();

export const generateRandomString = async (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export async function getSessionCookie() {
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("sessionID");
  return sessionKey?.value;
}

export async function setSessionCookie() {
  const key = await generateRandomString(15);
  const cookieStore = await cookies();
  cookieStore.set({
    name: "sessionID",
    value: key,
    httpOnly: true,
  });
  return key;
}

export const uploadFile = async (file: File) => {
  try {
    const uploadData = await pinata.upload.file(file);
    const url = await pinata.gateways.createSignedURL({
      cid: uploadData.cid,
      expires: 36000000,
    });
    return url;
  } catch (e) {
    console.log(e);
    return "Something went wrong";
  }
};
async function saveToNeon(url: string, userId: string) {
  throw new Error("Function not implemented.");
}

export async function getPodcasts(): Promise<Podcast[]> {
  const podcasts = await prisma.podcast.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      imageUrl: true,
    },
  });

  return podcasts.map((podcast: Podcast) => ({
    id: podcast.id,
    titile: podcast.titile, // Fixing the typo from your example "titile" instead of "title"
    author: podcast.author,
    imageUrl: podcast.imageUrl || null, // Ensures optional field handling
  }));
}

export async function getPodcastById(id: number) {
  const podcast = await prisma.podcast.findUnique({
    where: {
      id: id, // Use the id to find a unique podcast
    },
  });

  if (!podcast) {
    throw new Error(`Podcast with id ${id} not found`);
  }

  return podcast;
}

export async function getSummary(podcastId: number, language: string) {
  const podcast = await prisma.podcast.findUnique({
    where: {
      id: podcastId,
    },
    include: {
      transcripts: {
        where: {
          language: language,
        },
        select: {
          summary: true,
        },
      },
    },
  });

  if (!podcast || !podcast.transcripts.length) {
    throw new Error(
      `Summary not found for podcast ID ${podcastId} in ${language}`,
    );
  }

  return podcast.transcripts[0].summary;
}

export async function getChapters(
  podcastId: number,
  language: string,
): Promise<Episode[]> {
  const podcast = await prisma.podcast.findUnique({
    where: {
      id: podcastId,
    },
    include: {
      transcripts: {
        where: {
          language: language,
        },
        select: {
          chapters: true,
        },
      },
    },
  });

  if (
    !podcast ||
    !podcast.transcripts.length ||
    !podcast.transcripts[0].chapters
  ) {
    throw new Error(
      `Chapters not found for podcast ID ${podcastId} in ${language}`,
    );
  }

  const chapters = podcast.transcripts[0].chapters as Array<{
    start: number;
    end: number;
    headline: string;
    summary: string;
    gist: string;
  }>;

  return chapters.map(
    (
      value: {
        start: number;
        end: number;
        headline: string;
        summary: string;
        gist: string;
      },
      index: number,
    ) => ({
      id: index + 1,
      episode_number: index + 1,
      duration: formatDuration(value.end - value.start),
      title: value.headline,
      summary: value.summary,
      gist: value.gist,
      isPlaying: false,
      start: value.start,
    }),
  );
}

export async function getLyrics(podcastId: number, language: string) {
  try {
    const transcripts = await prisma.transcript.findMany({
      where: {
        podcastId,
        language,
      },
      select: {
        text: true,
        start: true,
        sentiment: true,
        speaker: true,
      },
    });

    const lines = transcripts.map((value: any) => {
      return {
        startTimeMs: `${Math.ceil(value.start * 1000)}`,
        words: value.text,
        sentiment: value.sentiment || "null",
        speaker: value.speaker,
      };
    });

    return { lines };
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    throw new Error("Failed to fetch lyrics");
  }
}

export async function getDivisions(
  theme: string | undefined,
  language: string,
) {
  // Fetch lines from the database based on the provided theme and language
  const lines_ = await prisma.transcript.findMany({
    where: {
      theme: theme || "default", // Use a default theme if none is provided
      language: language,
    },
    orderBy: {
      start: "asc", // Ensure lines are sorted by start time
    },
  });

  if (!lines_ || lines_.length === 0) {
    return [];
  }

  const divisions: Divisions = [];
  const colors = [
    "bg-blue-100 dark:bg-blue-700",
    "bg-green-100 dark:bg-green-700",
    "bg-red-100 dark:bg-red-700",
    "bg-yellow-100 dark:bg-yellow-700",
    "bg-lime-100 dark:bg-lime-700",
  ];
  const speakerColorMap: Record<string, string> = {};
  let currentOrder = 1;
  let totalDuration = 0;

  // Calculate total duration for percentage calculation
  lines_.forEach((line: any, index: any) => {
    const duration =
      index < lines_.length - 1 ? lines_[index + 1].start - line.start : 0; // Last line has no duration
    totalDuration += duration;
  });

  console.log("Total Duration is: ", totalDuration);

  // Process each line and calculate its division
  lines_.forEach((line: any, index: any) => {
    const duration =
      index < lines_.length - 1 ? lines_[index + 1].start - line.start : 0;

    const speaker = line.speaker || "Unknown";
    if (!speakerColorMap[speaker]) {
      // Assign a color to the speaker if not already assigned
      speakerColorMap[speaker] =
        colors[Object.keys(speakerColorMap).length % colors.length];
    }

    const percentage = totalDuration > 0 ? duration / totalDuration : 0;

    divisions.push({
      percentage: parseFloat(percentage.toFixed(19)),
      color: speakerColorMap[speaker],
      order: currentOrder++,
    });
  });

  return divisions;
}

async function getTranscript(
  audioUrl: string,
  podcastId: number,
  { basic_details, redaction, speakers }: TOverallForm,
): Promise<any> {
  const redactionKeys = Object.keys(redaction);
  const redactionList = redactionKeys.filter((value, index) => {
    return redaction[value as keyof typeof redaction];
  }) as PiiPolicy[];
  let transcript = await client.transcripts.transcribe({
    audio: audioUrl,
    speaker_labels: true,
    auto_chapters: true,
    redact_pii_audio: true,
    filter_profanity: basic_details.filter_profanity,
    redact_pii_policies: redactionList,
    sentiment_analysis: true,
    format_text: true,
    speakers_expected: speakers.speakers.split(",").length,
  });
  await updatePodcastTranscriptionId(podcastId, transcript.id);
  const sentencesResponse = await client.transcripts.sentences(transcript.id);
  const sentences = sentencesResponse.sentences;
  return sentences;
}

async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  const url = "https://api-free.deepl.com/v2/translate";

  const response = await axios.post(url, null, {
    params: {
      auth_key: apiKey,
      text: text,
      target_lang: targetLang.toUpperCase(),
    },
  });

  return response.data.translations[0].text;
}

export async function addNewTranscript(
  { basic_details, redaction, speakers }: TOverallForm,
  audioUrl: string,
) {
  let userId = await getSessionCookie();
  if (!userId) {
    userId = await setSessionCookie();
  }
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        podcasts: {
          create: [],
        },
      },
    });
  }

  const imageUrl = await uploadFile(basic_details.picture);
  const podcast = await prisma.podcast.create({
    data: {
      title: basic_details.podcastTitle,
      author: basic_details.authorName,
      imageUrl: imageUrl,
      userId: userId,
    },
  });

  const englishTranscript = await getTranscript(audioUrl, podcast.podcastId, {
    basic_details,
    redaction,
    speakers,
  });
  const targetLangs = ["fr", "germ", "sp"];
  for (const line of englishTranscript) {
    for (const targetLang of targetLangs) {
      const translatedText = await translateText(line.text, targetLang);

      await prisma.transcript.create({
        data: {
          language: targetLang,
          text: translatedText,
          start: line.start,
          sentiment: line.sentiment,
          speaker: line.speaker,
          podcastId: podcast.id, // Associate the transcript with the newly created podcast
        },
      });
    }
  }
}

async function updatePodcastTranscriptionId(
  podcastId: number,
  transcriptionId: string,
) {
  const updatedPodcast = await prisma.podcast.update({
    where: { id: podcastId }, // Find the podcast by its ID
    data: {
      transcriptionId: transcriptionId, // Set the new transcriptionId
    },
  });

  return updatedPodcast;
}
async function askAI(transcriptId: string, question: string): Promise<string> {
  const { response } = await client.lemur.task({
    transcript_ids: [transcriptId],
    prompt: question,
  });
  return response;
}

export async function askAIText(transcriptId: string, question: string) {
  const textAnswer = await askAI(transcriptId, question);
  const audioAnswerUrl = await generateAIResponseAudio(textAnswer);
  return {
    textAnswer,
    audioAnswerUrl,
  };
}
export async function askAIAudio(transcriptId: string, file: File) {
  const url = await uploadFile(file);
  const transcript = await client.transcripts.transcribe({
    audio: url,
    format_text: true,
  });
  const sentencesResponse = await client.transcripts.sentences(transcript.id);
  const sentences = sentencesResponse.sentences;
  const question = sentences
    .map((sentence) => {
      return sentence.text;
    })
    .join("\n");

  const textAnswer = await askAI(transcriptId, question);
  const audioAnswerUrl = await generateAIResponseAudio(textAnswer);
  return {
    textAnswer,
    audioAnswerUrl,
    question,
  };
}

async function generateAIResponseAudio(text: string) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  const responseArrayBuffer = await mp3.arrayBuffer();
  const audioFile = new File([responseArrayBuffer], "audio.mp3", {
    type: "audio/mpeg",
  });
  const url = uploadFile(audioFile);
  return url;
}
