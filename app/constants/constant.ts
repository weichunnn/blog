const HOST =
  process.env.NODE_ENV == "production"
    ? "https://wchun.xyz"
    : "http://localhost:3000";

export { HOST };
