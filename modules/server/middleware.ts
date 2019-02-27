const basicAuth = require("express-basic-auth");

export const enforcePasswordIfSpecified = (password: string) =>
  basicAuth({
    challenge: true,
    users: {
      "": password,
      admin: password,
    },
  });
