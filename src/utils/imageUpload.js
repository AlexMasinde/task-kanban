import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";

import { updateProfile } from "@firebase/auth";

import { auth } from "../firebase";

export function imageValidate(image) {
  const imageError = {};

  const extensions = ["jpg", "jpeg", "png", "gif"];
  const imageName = image.name;
  const imageExtesion = imageName.substring(imageName.lastIndexOf(".") + 1);
  if (!extensions.includes(imageExtesion)) {
    imageError.extension = "Image is not valid";
  }

  return {
    valid: Object.keys(imageError).length === 0,
    error: imageError,
  };
}

//upload imge to firebase
export async function uploadImage(image) {
  const currentUser = auth.currentUser;
  const imageName = image.name;

  const storage = getStorage();

  const imageRef = ref(storage, imageName);

  const allImagesRef = ref(
    storage,
    `userimages/${currentUser.uid}/${imageName}`
  );

  imageRef.name = allImagesRef.name;
  imageRef.fullPath = allImagesRef.fullPath;

  const metaData = {
    cacheContol: "public,max-age=4000",
  };

  const uploadTask = await uploadBytes(imageRef, image, metaData);
  const downloadURL = await getDownloadURL(uploadTask.ref);

  await updateProfile(currentUser, {
    photoURL: downloadURL,
  });
}
