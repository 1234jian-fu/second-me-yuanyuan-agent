import type {
  CaptureAnalysisResult,
  CapturePipelineTask,
  CaptureSource,
  CaptureStatus,
  CloudPipelineStatus,
} from "@/types/capture";
import { createLocalId } from "@/utils/ids";

type CreateCaptureTaskInput = {
  source: CaptureSource;
  localUri?: string;
  remotePath?: string;
  status?: CaptureStatus;
  errorMessage?: string;
};

type TransitionCaptureTaskInput = Pick<CreateCaptureTaskInput, "remotePath" | "errorMessage"> & {
  analysis?: CaptureAnalysisResult;
};

function now() {
  return new Date().toISOString();
}

export const capturePipelineService = {
  createTask(input: CreateCaptureTaskInput): CapturePipelineTask {
    const timestamp = now();

    return {
      id: createLocalId("capture"),
      source: input.source,
      status: input.status ?? "queued",
      createdAt: timestamp,
      updatedAt: timestamp,
      localUri: input.localUri,
      remotePath: input.remotePath,
      errorMessage: input.errorMessage,
    };
  },

  createCloudTask(input: Omit<CreateCaptureTaskInput, "status"> & { status?: CloudPipelineStatus }) {
    return this.createTask({
      ...input,
      status: input.status ?? "pending_upload",
    });
  },

  transition(
    task: CapturePipelineTask,
    status: CaptureStatus,
    input: TransitionCaptureTaskInput = {},
  ): CapturePipelineTask {
    return {
      ...task,
      status,
      updatedAt: now(),
      remotePath: input.remotePath ?? task.remotePath,
      errorMessage: input.errorMessage,
      analysis: input.analysis ?? task.analysis,
    };
  },
};
