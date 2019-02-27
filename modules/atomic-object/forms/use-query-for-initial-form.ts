import { useApolloClient } from "react-apollo-hooks";

import * as React from "react";
import { FetchPolicy, ErrorPolicy } from "apollo-client";
import { GraphqlBundle } from "client/graphql/core";

export interface QueryBaseOptions<TVariables> {
  variables?: TVariables;
  fetchPolicy?: FetchPolicy;
  errorPolicy?: ErrorPolicy;
  fetchResults?: boolean;
}

interface QueryInitialFormProps<TData, TVars, TResult>
  extends QueryBaseOptions<TVars> {
  query: GraphqlBundle<TResult, TVars>;
  queryToFormData: (queryResult: TResult) => TData;
}
export function useQueryForInitialForm<
  TData,
  TVars,
  TResult = any,
  TFormData = any
>(
  props: QueryInitialFormProps<TData, TVars, TResult>
):
  | { loading: true; initialValues: null }
  | { loading: false; initialValues: TData } {
  const { query, variables, queryToFormData: toFormData } = props;
  const apollo = useApolloClient()!;
  const [initial, setInitial] = React.useState<null | TData>(null);
  const fetchInitial = React.useCallback(async () => {
    const result = await apollo.query<TResult, TVars>({
      fetchPolicy: "network-only",
      ...props,
      query: query.Document,
      variables,
    });

    if (!result.data) {
      throw new Error("Couldn't fetch initial form data from query!");
    }
    const newInitial = toFormData(result.data);
    setInitial(newInitial);
  }, []);

  React.useEffect(() => {
    void fetchInitial();
  }, []);

  if (initial === null) {
    return { loading: true, initialValues: null };
  } else {
    return {
      loading: false,
      initialValues: initial,
    };
  }
}
