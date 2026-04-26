import * as FileSystem from "expo-file-system/legacy";

import { formatDateTime } from "@/utils/date";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function runMockSettingsSync() {
  await sleep(700);
  return formatDateTime(new Date());
}

export async function exportMobileSnapshot(snapshot: unknown) {
  const baseDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  if (!baseDirectory) {
    throw new Error("当前设备暂时无法获取导出目录。");
  }

  const exportDirectory = `${baseDirectory}second-me-exports/`;
  const fileUri = `${exportDirectory}mobile-settings-${Date.now()}.json`;

  const directoryInfo = await FileSystem.getInfoAsync(exportDirectory);
  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(exportDirectory, { intermediates: true });
  }

  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(snapshot, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return fileUri;
}
