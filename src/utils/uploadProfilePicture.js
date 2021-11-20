import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

export default function uploadProfilePicture(file, email) {
  const fileRef = ref(storage, `profileImages/${email}/${file.name}`);
  const uploadJob = uploadBytes(fileRef, file);
  uploadJob.on(
    "state_changed",
    (error) => {},
    () => {
      getDownloadURL(uploadJob.snapshot.ref).then((downloadURL) => {
        return downloadURL;
      });
    }
  );
}
