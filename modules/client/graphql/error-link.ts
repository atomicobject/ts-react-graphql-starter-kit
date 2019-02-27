import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { History } from "history";

export function buildErrorLink(history: History<any>): ApolloLink {
  return onError(({ graphQLErrors, networkError }) => {
    console.log("graphql error", graphQLErrors);
    console.log("network error", networkError);
    if (networkError) {
      if ((networkError as any).statusCode === 403) {
        window.location.assign("/auth/login");
      } else {
        history.push("/error");
      }
      return;
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
      history.push("/error");
    }
  });
}
