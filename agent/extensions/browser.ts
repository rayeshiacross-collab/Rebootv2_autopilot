import browser from "@agent-browser/eve";

export default browser({
  // Allow YouTube + related domains needed for channel management
  allowedDomains: [
    "youtube.com",
    "*.youtube.com",
    "youtu.be",
    "studio.youtube.com",
    "*.studio.youtube.com",
    "google.com",
    "*.google.com",
    "accounts.google.com",
    "www.googleapis.com",
  ],
  maxOutputChars: 60_000,
  contentBoundaries: true,
  inlineScreenshots: true,
});
