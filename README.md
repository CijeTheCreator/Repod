<a name="readme-top"></a>

# RepodAI: An AI-Powered Podcasting Platform with Transcription, Summarization, and Interactive Features 🎙️

![RepodAI: An AI-Powered Podcasting Platform with Transcription, Summarization, and Interactive Features 🎙️](/.github/images/thumb.png "RepodAI: An AI-Powered Podcasting Platform with Transcription, Summarization, and Interactive Features 🎙️")

## :toolbox: Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env` file in **root** directory.
4. Contents of `.env`:

```env
# .env

# neon db uri
DATABASE_URL="postgresql://<user>:<password>@<host>:<post>/lingo?sslmode=require"

# openai api key
OPENAI_KEY="sk-###############################################################"

# pinata secrets
PINATA_JWT="###############################################################"
NEXT_PUBLIC_GATEWAY_URL="###############################################################"
```

## :camera: Screenshots

![Screenshot](/.github/images/Podcast%20Screenshot%201.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%202.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%203.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%204.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%205.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%206.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%207.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%208.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%209.png "Screenshot")
![Screenshot](/.github/images/Podcast%20Screenshot%2010.png "Screenshot")

## AssemblyAI References

```typescript
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
```

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react "React JS")](https://react.dev/ "React JS") [![Next JS](https://skillicons.dev/icons?i=next "Next JS")](https://nextjs.org/ "Next JS") [![Typescript](https://skillicons.dev/icons?i=ts "Typescript")](https://www.typescriptlang.org/ "Typescript") [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind "Tailwind CSS")](https://tailwindcss.com/ "Tailwind CSS") [![Vercel](https://skillicons.dev/icons?i=vercel "Vercel")](https://vercel.app/ "Vercel") [![Postgresql](https://skillicons.dev/icons?i=postgres "Postgresql")](https://www.postgresql.org/ "Postgresql")[![Neon](/.github/images/neon.png "Neon")](https://neon.tech/ "Neon")[![AssemblyAI](/.github/images/assemblyai.png "Assembly AI")](https://www.assemblyai.com/ "Assembly AI")
