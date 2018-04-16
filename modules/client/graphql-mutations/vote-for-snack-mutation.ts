import { SnackId } from "records/snack-record";
import { ApolloClient } from "apollo-client";
import {
  VoteForSnackMutation,
  VoteForSnackMutationVariables
} from "client/graphql-types";

const MUTATION = require("./VoteForSnack.graphql");

export function voteForSnackMutation(
  apolloClient: ApolloClient<any>,
  snack: { id: SnackId; voteCount: number }
) {
  return apolloClient.mutate<VoteForSnackMutation>({
    mutation: MUTATION,

    variables: {
      snackId: snack.id
    } as VoteForSnackMutationVariables,

    optimisticResponse: {
      voteFor: {
        __typename: "Vote",
        id: -1,
        snack: {
          __typename: "Snack",
          id: snack.id,
          voteCount: snack.voteCount + 1
        }
      }
    } as VoteForSnackMutation
  });
}
