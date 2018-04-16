import * as express from "express";

import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import * as bodyParser from "body-parser";
import * as config from "config";
import * as morgan from "morgan";
import * as db from "../db";
import * as compression from "compression";

const knex = db.getConnection();
const knexLogger = require("knex-logger");
const enforce = require("express-sslify");
const expressStaticGzip = require("express-static-gzip");

import { executableSchema } from "graphql-api";
import { Context } from "graphql-api/context";

let app = express();

export const port = config.get<number>("server.port");
export const publicHost = config.get<string>("server.publicHost");
export const apiHost = config.get<string>("server.apiHost");

export function startServer() {
  // Logging
  app.use(morgan("short"));
  app.use(knexLogger(knex));

  // Force SSL.
  if (config.get("server.requireSsl")) {
    app.use(
      enforce.HTTPS({
        trustProtoHeader: true
      })
    );
  }

  // Static assets
  app.use(expressStaticGzip("./dist/"));
  app.use(express.static("./dist/"));

  // Gzip support
  app.use(compression());

  // GraphQL
  app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress((req, res) => ({
      schema: executableSchema,

      // Create the context for the request. Get auth info from `req`
      // if necessary
      context: new Context()
    }))
  );

  if (config.get("server.graphiql")) {
    // GraphQL development web IDE
    app.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql"
      })
    );
  }

  // Serve index.html for all unknown URLs
  app.get("/*", function(req, res) {
    res.sendFile(process.cwd() + "/dist/index.html");
  });

  return app.listen(port, () => {
    console.log("up and running on port", port);
  });
}
