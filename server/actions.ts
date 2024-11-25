"use server";

import { cookies } from "next/headers";
import { pinata } from "./pinata";

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
  return sessionKey;
}

export async function setSessionCookie() {
  const key = await generateRandomString(15);
  const cookieStore = await cookies();
  cookieStore.set({
    name: "sessionID",
    value: key,
    httpOnly: true,
  });
}

export const UploadFile = async (userId: string, file: File) => {
  try {
    const uploadData = await pinata.upload.file(file);
    const url = await pinata.gateways.createSignedURL({
      cid: uploadData.cid,
      expires: 3600,
    });
    await saveToNeon(url, userId);
    return "success";
  } catch (e) {
    console.log(e);
    return "Something went wrong";
  }
};
async function saveToNeon(url: string, userId: string) {
  throw new Error("Function not implemented.");
}
