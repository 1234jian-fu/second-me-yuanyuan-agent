import { getCurrentUserId, getSupabaseClient } from "@/services/supabaseClient";

export const AUDIO_BUCKET = "audio-entries";

export type StorageProvider = "supabase";

export type UploadObjectInput = {
  bucket: string;
  uri: string;
  pathPrefix?: string;
  fileName?: string;
  contentType?: string;
};

export type UploadObjectResult = {
  bucket: string;
  provider: StorageProvider;
  storagePath: string;
  signedUrl?: string;
};

export type UploadAudioInput = {
  uri: string;
  fileName?: string;
  contentType?: string;
};

export type UploadAudioResult = UploadObjectResult;

export type ObjectStorageService = {
  uploadObject(input: UploadObjectInput): Promise<UploadObjectResult>;
  createSignedUrl(bucket: string, storagePath: string, expiresInSeconds?: number): Promise<string | null>;
};

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export const supabaseStorageService: ObjectStorageService = {
  async uploadObject(input: UploadObjectInput): Promise<UploadObjectResult> {
    const supabase = getSupabaseClient();
    const userId = await getCurrentUserId();
    const fileName = sanitizeFileName(input.fileName ?? `object-${Date.now()}`);
    const prefix = input.pathPrefix?.replace(/^\/+|\/+$/g, "") || "uploads";
    const storagePath = `${userId}/${prefix}/${Date.now()}-${fileName}`;

    // Expo can fetch a local file URI and turn it into a Blob for Supabase Storage.
    const fileResponse = await fetch(input.uri);
    const blob = await fileResponse.blob();

    const { error } = await supabase.storage.from(input.bucket).upload(storagePath, blob, {
      contentType: input.contentType ?? "application/octet-stream",
      upsert: false,
    });

    if (error) {
      throw error;
    }

    const signedUrl = await this.createSignedUrl(input.bucket, storagePath);
    return {
      bucket: input.bucket,
      provider: "supabase",
      storagePath,
      signedUrl: signedUrl ?? undefined,
    };
  },

  async createSignedUrl(bucket: string, storagePath: string, expiresInSeconds = 60 * 60) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error) {
      return null;
    }

    return data.signedUrl;
  },
};

export const storageService = {
  ...supabaseStorageService,

  async uploadAudio(input: UploadAudioInput): Promise<UploadAudioResult> {
    return supabaseStorageService.uploadObject({
      bucket: AUDIO_BUCKET,
      uri: input.uri,
      pathPrefix: "audio",
      fileName: input.fileName ?? `recording-${Date.now()}.m4a`,
      contentType: input.contentType ?? "audio/m4a",
    });
  },
};
