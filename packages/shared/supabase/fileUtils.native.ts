// Native implementation using expo-file-system
import { File } from 'expo-file-system';

export async function readFileAsBase64(uri: string): Promise<string> {
  const file = new File(uri);
  return await file.base64();
}
