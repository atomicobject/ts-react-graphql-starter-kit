import { ApolloCache } from "apollo-cache";
import { withClientState } from "apollo-link-state";
import { ClientSideResolvers } from "./resolvers";
import { ApolloLink } from "apollo-link";

import { Query as ClientSideQuery } from "./types.gen";
import { Query as ServerSideQuery } from "graphql-api/server-types.gen";
import * as DateIso from "core/date-iso";
type ClientSideProps = Exclude<keyof ClientSideQuery, keyof ServerSideQuery>;

export type ClientState = Pick<ClientSideQuery, ClientSideProps>;

export const DEFAULTS: ClientState = {
  localName: "friend",
  localDate: DateIso.toIsoDate(new Date()),
};

export function buildClientLink(
  cache: ApolloCache<any>,
  defaults: ClientState = DEFAULTS
): ApolloLink {
  const link = withClientState({
    cache,
    resolvers: ClientSideResolvers,
    defaults: defaults,
  });
  return link;
}
