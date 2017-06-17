import {
  ApolloProvider,
  ApolloClient,
  createNetworkInterface,
  getDataFromTree
} from "react-apollo";

import { GraphQLSchema } from "graphql";

import resolvers from "./resolvers";

const { createLocalInterface } = require("apollo-local-query");

import * as graphql from "graphql";

import { UserRepository } from "../records/user";
import * as db from "../db";

import { executableSchema } from "./index";

export function buildLocalApollo(schema: GraphQLSchema = executableSchema) {
  return new Context().apolloClient;
}

/** The graphql context type for this app.  */
export class Context {
  constructor(schema: GraphQLSchema = executableSchema) {
    this.apolloClient = new ApolloClient({
      ssrMode: true,
      networkInterface: createLocalInterface(graphql, schema, {
        context: this
      })
    });
  }

  // Add global request context, such as
  // repositories and dataloaders here.
  // someRepo = new SomeRepository()

  /** An ApolloClient which can be used for local graphql queries. Does not hit the network. */
  apolloClient: ApolloClient;

  // TODO: Perhaps compose this in?
  private conn = db.getConnection();
  users = new UserRepository(this.conn);
}

/** Builds a new empty context for a request. */
export function buildContext(schema: GraphQLSchema): Context {
  return new Context(schema);
}
