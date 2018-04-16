import { ApolloClient } from "apollo-client";
import {
  AddSnackMutation,
  AddSnackMutationVariables
} from "client/graphql-types";

const MUTATION = require("./AddSnack.graphql");

export function addSnackMutation(
  apolloClient: ApolloClient<any>,
  snack: { name: string }
) {
  const name = snack.name;
  return apolloClient.mutate<AddSnackMutation>({
    mutation: MUTATION,

    variables: { name } as AddSnackMutationVariables,

    optimisticResponse: {
      addSnack: {
        __typename: "Snack",
        id: -1,
        name,
        voteCount: 0
      }
    } as AddSnackMutation,

    refetchQueries: ["DashboardSnacks"]
  });
}
