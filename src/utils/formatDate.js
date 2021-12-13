export function formatTaskDate(createdAt) {
  const options = { day: "numeric", month: "short" };

  if (createdAt.hasOwnProperty("seconds")) {
    return new Date(createdAt.seconds * 1000).toLocaleDateString(
      "en-UK",
      options
    );
  }
  return new Date(createdAt).toLocaleDateString("en-UK", options);
}

export function formatProjectDateTime(createdAt) {
  const dayDateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };

  const timeOptions = { hour: "numeric", minute: "numeric" };

  if (createdAt.hasOwnProperty("seconds")) {
    const transformedDate = new Date(createdAt.seconds * 1000);
    const dayDate = transformedDate.toLocaleDateString("en-UK", dayDateOptions);
    const time = transformedDate.toLocaleTimeString("en-UK", timeOptions);
    return { dayDate, time };
  }
  const transformedDate = new Date(createdAt);
  const dayDate = transformedDate.toLocaleDateString("en-UK", dayDateOptions);
  const time = transformedDate.toLocaleTimeString("en-UK", timeOptions);
  return { dayDate, time };
}
