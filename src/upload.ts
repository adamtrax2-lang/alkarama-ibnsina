import { supabase, isSupabaseConfigured, IMAGE_BUCKET } from "./supabase";

/*
  Photo upload for the admin panel.

  Flow: the client picks a photo -> we shrink and re-encode it in the browser (so a 5 MB
  phone photo becomes a ~150-300 KB web image, keeping the free Storage tier comfortable)
  -> we upload it to the public `site-images` bucket -> we return its public URL, which is
  stored in the content JSON exactly where a "/public/..." path used to live.

  No extra libraries: compression is done with a plain <canvas>. Everything runs client-side.
*/

const MAX_DIMENSION = 1600; // longest side, px. Plenty for full-width web photos.
const JPEG_QUALITY = 0.82;

// Read a File into an HTMLImageElement.
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image illisible."));
    };
    img.src = url;
  });
}

// Resize (if needed) and re-encode to a compressed JPEG Blob.
async function compress(file: File): Promise<Blob> {
  // Non-raster files (svg) or tiny files: upload as-is, no point re-encoding.
  if (file.type === "image/svg+xml") return file;

  const img = await loadImage(file);
  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file; // canvas unavailable, fall back to the original file
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
  );
  // If compression somehow produced a bigger file, keep the original.
  if (!blob || blob.size >= file.size) return file;
  return blob;
}

function extensionFor(blob: Blob, original: File): string {
  if (blob.type === "image/jpeg") return "jpg";
  if (original.name.includes(".")) return original.name.split(".").pop()!.toLowerCase();
  return "img";
}

export type UploadResult = { ok: boolean; url?: string; error?: string };

/*
  Compress + upload one image. `folder` groups files in the bucket (hotels/packs/hero/...).
  Returns the public URL to store in the content.
*/
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "Upload indisponible en mode local. Configurez la base de donnees." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Veuillez choisir un fichier image." };
  }
  try {
    const blob = await compress(file);
    const ext = extensionFor(blob, file);
    // Unique-ish name without Date.now/Math.random (both fine in the browser, but keep it simple).
    const stamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const rand = Math.floor(performance.now() % 100000);
    const path = `${folder}/${stamp}-${rand}.${ext}`;

    const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
      cacheControl: "31536000",
      contentType: blob.type || file.type,
      upsert: false,
    });
    if (error) return { ok: false, error: error.message };

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Echec de l'upload." };
  }
}
