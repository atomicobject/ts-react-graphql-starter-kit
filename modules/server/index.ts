import * as express from "express";
// import * as cors from "cors";
// import { apiEndpoint } from "./graphql/endpoint";
import * as config from 'config';

let app = express();

export const port = config.get<number>("server.port");
export const publicHost = config.get<string>("server.publicHost");
export const apiHost = config.get<string>("server.apiHost");

export function startServer() {
  // app.use(cors());
  app.use(express.static("./dist/"));
  // app.use("/api", apiEndpoint);

  app.listen(port, () => {
    console.log("up and running on port", port);
  });
}