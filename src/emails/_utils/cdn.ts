export function getCdnUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://healium-app.vercel.app/_next/static/media"
    : "";
}

export function getAssetUrl(relativeUrl: string) {
  const relUrl =
    process.env.NODE_ENV === "production"
      ? relativeUrl
      : `static/${relativeUrl}`;

  return `${getCdnUrl()}/${relUrl}`;
}
