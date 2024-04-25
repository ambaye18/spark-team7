export const API_URL: string =
  process.env.NODE_ENV === "production"
    ? "https://marvelous-reprieve-production.up.railway.app/"
    : "http://localhost:5005";
