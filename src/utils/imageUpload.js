import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import { updateProfile } from "@firebase/auth";
import { v4 as uuidv4 } from "uuid";

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

//upload image to firebase
export async function uploadImage(image) {
  const currentUser = auth.currentUser;

  const storage = getStorage();

  const imageRef = ref(storage, `userimages/${currentUser.uid}`);

  const metaData = {
    cacheContol: "public,max-age=4000",
  };

  const uploadTask = await uploadBytes(imageRef, image, metaData);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  console.log(downloadURL);

  await updateProfile(currentUser, {
    photoURL: downloadURL,
  });
}
