import * as express from "express";

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as morgan from 'morgan';
import * as db from '../db';
import * as compression from 'compression';

const knex = db.getConnection();
const knexLogger = require('knex-logger');
const enforce = require('express-sslify')
const expressStaticGzip = require("express-static-gzip");

import { makeExecutableSchema } from 'graphql-tools';

import { schema, resolvers, buildContext } from '../graphql';

let app = express();

export const port = config.get<number>("server.port");
export const publicHost = config.get<string>("server.publicHost");
export const apiHost = config.get<string>("server.apiHost");

export function startServer() {
  // Logging
  app.use(morgan('short'));
  app.use(knexLogger(knex));

  app.use(expressStaticGzip("./dist/"))
  app.use(express.static("./dist/"));

  // Force SSL.
  if (config.get("server.requireSsl")) {
    app.use(enforce.HTTPS({
      trustProtoHeader: true
    }));
  }

  // Gzip support
  // app.use(compression());
  app.use("/graphql", bodyParser.json(), graphqlExpress((req, res) => ({
    schema: makeExecutableSchema({ typeDefs: schema, resolvers: resolvers }),

    // Create the context for the request. Get auth info from `req`
    // if necessary
    context: buildContext()
  })));

  if (config.get("server.graphiql")) {
    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
    }));
  }

  app.get('/*', function (req, res) {
    res.sendFile(process.cwd() + '/dist/index.html');
  });

  app.listen(port, () => {
    console.log("up and running on port", port);
  });
}