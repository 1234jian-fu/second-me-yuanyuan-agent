import { env, getHubBaseUrl } from "@/config/env";
import { audioEntryService } from "@/services/audioEntryService";
import { capturePipelineService } from "@/services/capturePipelineService";
import { storageService } from "@/services/storageService";
import type { CaptureAnalysisResult, CapturePipelineTask, CaptureSource } from "@/types/capture";

export type CloudPipelineRecordKind = "audio" | "text";

export type AnalyzeCaptureInput = {
  id?: string;
  kind: CloudPipelineRecordKind;
  title?: string | null;
  content?: string | null;
  storagePath?: string | null;
  signedUrl?: string | null;
};

export type UploadAudioToCloudInput = {
  uri: string;
  fileName?: string;
  title?: string | null;
  contentType?: string;
  durationSeconds?: number | null;
  fileSize?: number | null;
};

export type CloudPipelineResult = {
  task: CapturePipelineTask;
  recordId?: string;
  analysis: CaptureAnalysisResult;
};

type HubAnalyzeResponse = CaptureAnalysisResult & {
  ok?: boolean;
};

function createMockAnalysis(input: AnalyzeCaptureInput): CaptureAnalysisResult {
  const sourceText = input.content?.trim() || input.title?.trim() || input.storagePath || "new capture";

  return {
    transcript: input.kind === "audio" ? `Mock transcript for ${sourceText}` : input.content ?? null,
    summary: `Mock summary: ${sourceText}`.slice(0, 160),
    categories: input.kind === "audio" ? ["voice", "capture"] : ["text", "capture"],
    provider: "local-mock",
    model: null,
  };
}

async function callHubAnalysis(input: AnalyzeCaptureInput): Promise<CaptureAnalysisResult> {
  const hubBaseUrl = getHubBaseUrl();

  if (!hubBaseUrl) {
    return createMockAnalysis(input);
  }

  const response = await fetch(`${hubBaseUrl}/v1/pipeline/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.aiProxyToken ? { Authorization: `Bearer ${env.aiProxyToken}` } : {}),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return createMockAnalysis(input);
  }

  const data = (await response.json()) as HubAnalyzeResponse;
  return {
    transcript: data.transcript ?? null,
    summary: data.summary ?? null,
    categories: Array.isArray(data.categories) ? data.categories : [],
    provider: data.provider ?? "hub",
    model: data.model ?? null,
  };
}

export const cloudPipelineService = {
  createPendingTask(source: CaptureSource, localUri?: string) {
    return capturePipelineService.createCloudTask({
      source,
      localUri,
    });
  },

  async analyze(input: AnalyzeCaptureInput): Promise<CaptureAnalysisResult> {
    try {
      return await callHubAnalysis(input);
    } catch {
      return createMockAnalysis(input);
    }
  },

  async uploadAudio(input: UploadAudioToCloudInput): Promise<CloudPipelineResult> {
    let task = this.createPendingTask("mobile-audio", input.uri);

    try {
      task = capturePipelineService.transition(task, "uploading");
      const uploaded = await storageService.uploadAudio({
        uri: input.uri,
        fileName: input.fileName,
        contentType: input.contentType,
      });

      task = capturePipelineService.transition(task, "uploaded", {
        remotePath: uploaded.storagePath,
      });

      const entry = await audioEntryService.create({
        title: input.title,
        storagePath: uploaded.storagePath,
        publicUrl: uploaded.signedUrl ?? null,
        durationSeconds: input.durationSeconds,
        mimeType: input.contentType ?? "audio/m4a",
        fileSize: input.fileSize,
        metadata: {
          bucket: uploaded.bucket,
          provider: uploaded.provider,
          pipelineStatus: "uploaded",
        },
      });

      task = {
        ...capturePipelineService.transition(task, "analyzing"),
        recordId: entry.id,
      };

      const analysis = await this.analyze({
        id: entry.id,
        kind: "audio",
        title: input.title,
        storagePath: uploaded.storagePath,
        signedUrl: uploaded.signedUrl,
      });

      task = capturePipelineService.transition(task, "completed", {
        analysis,
      });

      return {
        task,
        recordId: entry.id,
        analysis,
      };
    } catch (error) {
      const failedTask = capturePipelineService.transition(task, "failed", {
        errorMessage: error instanceof Error ? error.message : "Cloud pipeline failed.",
      });

      return {
        task: failedTask,
        recordId: failedTask.recordId,
        analysis: createMockAnalysis({
          kind: "audio",
          title: input.title,
          storagePath: failedTask.remotePath,
        }),
      };
    }
  },
};
