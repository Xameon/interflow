import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { storage } from './firebase';

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async file => {
    const storageRef = ref(storage, `images/${uuidv4()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return url;
  });

  return Promise.all(uploadPromises);
};
