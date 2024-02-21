const formatDateDistance = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return `${Math.floor(diffDays / 7)} minggu lalu`;
  } else if (diffDays > 0) {
    return `${diffDays} hari lalu`;
  } else if (diffHours > 0) {
    return `${diffHours} jam lalu`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} menit lalu`;
  } else {
    return `${diffSeconds} detik lalu`;
  }
};

export default formatDateDistance;
