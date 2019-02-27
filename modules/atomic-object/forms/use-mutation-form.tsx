import { Isomorphism } from "@atomic-object/lenses";
import { PureQueryOptions } from "apollo-client";
import { GraphQLError } from "graphql";
import { useCallback, useState } from "react";
import { RefetchQueriesProviderFn } from "react-apollo";
import { useMutation } from "react-apollo-hooks";
import { SubmitFn } from "./core";
import { GraphqlBundle } from "client/graphql/core";

export type MutationFormState =
  | { key: "INITIAL" }
  | { key: "SUBMITTING" }
  | { key: "SUBMITTED" }
  | { key: "ERROR"; errors: ReadonlyArray<GraphQLError> };

export type MutationWrapperProps<TState, TVars, TResult, TFormData> = {
  /** The mutation function to submit to */
  mutation: GraphqlBundle<TResult, TVars>;
  /** Called with the mutation result after submitting */
  onMutate?: (result: TResult) => void;

  /** UNUSED parameter. Passing this in is just to inform TypeScript of intended types. */
  valuesFormDataIso?: Isomorphism<TState, TFormData>;

  /** Error handler */
  onError?: (result: ReadonlyArray<Error>) => void;
  formDataToVars: (state: TState) => TVars;

  // Apollo options
  refetchQueries?: Array<string | PureQueryOptions> | RefetchQueriesProviderFn;
  awaitRefetchQueries?: boolean;
};

/** Produces input props for an IsoForm that invoke a mutation on submit. */
export function useMutationForm<TData, TVars, TResult = any, TFormData = any>(
  props: MutationWrapperProps<TData, TVars, TResult, TFormData> & {}
) {
  const [state, setState] = useState<MutationFormState>({
    key: "INITIAL",
  });

  const { formDataToVars, refetchQueries, awaitRefetchQueries } = props;

  const mutate = useMutation<TResult, TVars>(props.mutation.Document);

  const onSubmit = useCallback<SubmitFn<TData>, any>(
    async (data, formik) => {
      try {
        setState({ key: "SUBMITTING" });

        const result = await mutate({
          variables: formDataToVars(data),
          refetchQueries,
          awaitRefetchQueries,
        });

        setState({ key: "SUBMITTED" });

        if (result.errors && result.errors.length > 0) {
          setState({
            key: "ERROR",
            errors: result.errors,
          });
          if (props.onError) {
            props.onError(result.errors);
          }
          return;
        }

        if (!result.data) {
          throw new Error("Didn't get data?");
        }

        if (props.onMutate) await props.onMutate(result.data);
      } catch (e) {
        if (props.onError) {
          props.onError(e.graphQLErrors || [e]);
        } else {
          setState({
            key: "ERROR",
            errors: e.graphQLErrors || [e],
          });
          formik.setSubmitting(false);
        }

        return;
      }
    },
    [
      formDataToVars,
      props.onMutate,
      props.mutation,
      refetchQueries,
      awaitRefetchQueries,
    ]
  );

  return { onSubmit, state };
}
