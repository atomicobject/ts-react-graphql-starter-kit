import * as express from "express";
import * as cors from "cors";
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import * as bodyParser from 'body-parser';
import * as config from 'config';

import { makeExecutableSchema } from 'graphql-tools';

import {schema, resolvers} from '../graphql';

let app = express();

export const port = config.get<number>("server.port");
export const publicHost = config.get<string>("server.publicHost");
export const apiHost = config.get<string>("server.apiHost");

export function startServer() {
  app.use(cors());
  app.use(express.static("./dist/"));

  // Force SSL.
  if (config.get("server.requireSsl")) {
    app.use((req, res, next) => {
      if (req.protocol !== "https" && req.headers["x-forwarded-proto"] !== "https") {
        return res.status(403).send({ message: "SSL required" });
      }
      // allow the request to continue
      next();
    });
  }

  app.use("/graphql", bodyParser.json(), graphqlExpress({
    schema: makeExecutableSchema({typeDefs: schema, resolvers: resolvers})
  }));

  if (config.get("server.graphiql")) {
    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
    }));
  }

  app.listen(port, () => {
    console.log("up and running on port", port);
  });
}