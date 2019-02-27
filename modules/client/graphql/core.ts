import { DocumentNode } from "graphql";

export type GraphqlBundle<TResult, TVars> = {
  _variables: TVars;
  _result: TResult;
  Document: DocumentNode;
};
