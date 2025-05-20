import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { storage } from './firebase';

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async file => {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
    });

    const storageRef = ref(
      storage,
      `images/${uuidv4()}_${compressedFile.name}`,
    );
    const snapshot = await uploadBytes(storageRef, compressedFile);
    const url = await getDownloadURL(snapshot.ref);

    return url;
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
};
