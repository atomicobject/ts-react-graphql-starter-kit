import * as ErrorNotifier from "atomic-object/error-notifier";
import * as Logger from "atomic-object/logger";
import * as bodyParser from "body-parser";
import * as AuthRoutes from "client/routes/authentication-routes";
import * as compression from "compression";
import * as config from "config";
import * as express from "express";
import { formatError, GraphQLError } from "graphql";
import { executableSchema } from "graphql-api";
import { graphiqlExpress, graphqlExpress } from "graphql-server-express";
import { sortBy } from "lodash-es";
import * as morgan from "morgan";
import * as passport from "passport";
import { SavedUser } from "records/user";
import { migrateAndSeed } from "../../db/migrate-and-seed";
import * as db from "../db";
import { buildContext } from "./context";
import { enforcePasswordIfSpecified } from "./middleware";
import * as Authentication from "./authentication";

ErrorNotifier.setup(config.get("rollbar.serverAccessToken"));

const Arena = require("bull-arena");
const knex = db.getConnection();
const knexLogger = require("knex-logger");
const enforce = require("express-sslify");
const expressStaticGzip = require("express-static-gzip");
const cookieSession = require("cookie-session");

let app = express();

export const port = config.get<number>("server.port");

export const enableDeveloperLogin = config.get<boolean>(
  "server.enableDeveloperLogin"
);

export function startServer() {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(
    cookieSession({
      name: "session",
      secret: config.get<string>("server.secret"),
    })
  );

  // Logging
  app.use(morgan("short"));
  app.use(knexLogger(knex));

  // Force SSL.
  if (config.get("server.requireSsl")) {
    app.use(
      enforce.HTTPS({
        trustProtoHeader: true,
      })
    );
  }

  if (config.get("server.basicAuthPassword")) {
    app.use(enforcePasswordIfSpecified(config.get("server.basicAuthPassword")));
  }

  // Gzip support
  app.use(compression());

  // app.use(passport.initialize());
  // app.use(passport.session());

  app.use(
    "/arena",
    new Arena(
      {
        queues: [
          {
            name: "main",
            prefix: config.get("redis.prefix"),
            hostId: "redis",
            redis: config.get("redis.url"),
          },
        ],
      },
      {
        // Make the arena dashboard become available at {my-site.com}/arena.
        // basePath: "/arena",

        // Let express handle the listening.
        disableListen: true,
      }
    )
  );

  app.get(AuthRoutes.USER_NOT_FOUND, (req, res) => {
    res.sendFile(process.cwd() + "/dist/index.html");
  });

  // GraphQL
  app.use(
    "/graphql",
    bodyParser.json(),
    Authentication.createContext,
    // Authentication.ensureAuthenticatedAndSetStatus,
    graphqlExpress((req, res) => {
      return {
        schema: executableSchema,
        context: req!.context,
        formatError: (e: GraphQLError) => {
          Logger.error(e);
          return formatError(e);
        },
      };
    })
  );

  if (config.get("server.graphiql")) {
    // GraphQL development web IDE
    app.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql",
      })
    );
  }

  // Static assets
  app.use(expressStaticGzip("./dist/"));
  app.use(express.static("./dist/"));

  // Serve index.html for all unknown URLs
  app.get(
    "/*",
    // Authentication.ensureAuthenticatedAndRedirect,
    function(req, res) {
      res.sendFile(process.cwd() + "/dist/index.html");
    }
  );

  return app.listen(port, () => {
    console.log("up and running on port", port);
  });
}
