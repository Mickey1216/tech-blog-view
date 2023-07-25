const port = 3002;

export const requestBaseUrl =
  process.env.NODE_ENV === "development"
    ? `http://${document.domain}:${port}/`
    : "http://120.78.95.212:3002/";