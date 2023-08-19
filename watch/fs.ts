import * as FileSystem from "expo-file-system";
const FILES_RECEIVED_DIR = FileSystem.documentDirectory + "/FilesReceived";

export async function readDirectory() {
  const files = await FileSystem.readDirectoryAsync(FILES_RECEIVED_DIR);
  return files;
}

export async function deleteFile(fileUri) {
  try {
    await FileSystem.deleteAsync(fileUri);
    console.log("File deleted:", fileUri);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export async function deleteAllFiles() {
  const files = await readDirectory();
  files.forEach(async (file) => {
    await deleteFile(`${FILES_RECEIVED_DIR}/${file}`);
  });
}
