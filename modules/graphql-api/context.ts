import { ApolloClient } from "apollo-client";

import { GraphQLSchema } from "graphql";

import * as db from "../db";

import { executableSchema } from "./index";
import { Transaction } from "knex";

import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";

export function buildLocalApollo(schema: GraphQLSchema = executableSchema) {
  return new Context().apolloClient;
}

/** The graphql context type for this app.  */
export class Context {
  constructor(
    public pg: db.Knex = db.getConnection(),
    schema: GraphQLSchema = executableSchema
  ) {
    this.apolloClient = new ApolloClient({
      ssrMode: true,
      cache: new InMemoryCache(),
      link: new SchemaLink({
        schema: schema,
        context: this
      })
    });
  }

  /** An ApolloClient which can be used for local graphql queries. Does not hit the network. */
  apolloClient: ApolloClient<NormalizedCacheObject>;

  repos = new Repositories(this.pg);
}

export class Repositories {
  constructor(public pg: db.Knex) {}

  transaction(
    func: (repos: Repositories, transaction: Transaction) => Promise<any>
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.pg.transaction(async trx => {
          return await func(new Repositories(trx), trx);
        });

        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Add repositories here.
  // someRepo = new SomeRepository()
}
