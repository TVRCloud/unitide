import { supabaseServer } from "./supabase/server";

async function getFileHash(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function uploadFile(folder: string, file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const hash = await getFileHash(file);
  const fileName = `${folder}/${hash}.${ext}`;

  const { data: existingFile } = await supabaseServer.storage
    .from("unitide")
    .list(folder, { search: hash });

  if (existingFile?.length) {
    return { fileName: `${folder}/${existingFile[0].name}` };
  }

  const { error } = await supabaseServer.storage
    .from("unitide")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) return { error: error.message };

  return { fileName };
}

export async function getSignedUrl(path: string) {
  if (!path) return null;

  const { data, error } = await supabaseServer.storage
    .from("unitide")
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error("Supabase signed URL error:", error.message);
    return null;
  }

  return data.signedUrl;
}
