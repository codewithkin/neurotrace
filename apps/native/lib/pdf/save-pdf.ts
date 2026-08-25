import { Directory, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

/**
 * Saves a PDF into the user's file system.
 *
 * Android: opens the system folder picker (SAF) and copies the file into the
 * chosen location. iOS: presents the share sheet, which includes
 * "Save to Files".
 */
export async function savePdfToFiles(
  sourceUri: string,
  fileName: string,
): Promise<boolean> {
  if (Platform.OS === "ios") {
    await Sharing.shareAsync(sourceUri, {
      mimeType: "application/pdf",
      dialogTitle: fileName,
      UTI: "com.adobe.pdf",
    });
    return true;
  }

  const destinationDir = await Directory.pickDirectoryAsync();
  const source = new File(sourceUri);
  const destination = destinationDir.createFile(fileName, "application/pdf");
  if (!destination) return false;

  const bytes = new Uint8Array(await source.arrayBuffer());
  destination.write(bytes);
  return true;
}
