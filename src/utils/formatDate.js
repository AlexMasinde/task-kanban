export default function formatDate(createdAt) {
  const options = { day: "numeric", month: "short" };

  if (createdAt.hasOwnProperty("seconds")) {
    return new Date(createdAt.seconds * 1000).toLocaleDateString(
      "en-UK",
      options
    );
  }
  return new Date(createdAt).toLocaleDateString("en-UK", options);
}
