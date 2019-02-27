// import { Omit } from "lodash";

// import { IsoFormProps, IsoForm } from ".";

// import { MutationWrapperProps, MutationWrapper } from "./mutation-form-wrapper";

// import * as React from "react";

// export type MutationFormProps<TState, TVars, TResult, TFormData> = Omit<
//   IsoFormProps<TState, TFormData>,
//   "onSubmit"
// > &
//   Omit<MutationWrapperProps<TState, TVars, TResult, TFormData>, "children">;

// // Don't require vars for the common case where vars is just {data: TData}
// export function MutationForm<TData, TFormData = TData, TResult = any>(
//   props: MutationFormProps<TData, { data: TData }, TResult, TFormData>
// ): JSX.Element;

// // Require a vars input if vars can't be derived from data.
// export function MutationForm<TData, TVars, TFormData = TData, TResult = any>(
//   props: MutationFormProps<TData, TVars, TResult, TFormData> & {
//     /** Compute mutation variables from the form state */
//     vars: (state: TData) => TVars;
//   }
// ): JSX.Element;

// /** A Form for submitting to a mutation function */
// export function MutationForm<
//   TData,
//   TVars = TData,
//   TFormData = TData,
//   TResult = any
// >(
//   props: MutationFormProps<TData, TVars, TResult, TFormData> & {
//     vars?: (state: TData) => TVars;
//   }
// ) {
//   return (
//     <MutationWrapper {...props}>
//       {({ onSubmit, state }) => {
//         switch (state.key) {
//           case "INITIAL":
//             return (
//               <IsoForm {...props} onSubmit={onSubmit}>
//                 {props.children}
//               </IsoForm>
//             );
//           case "ERROR":
//             return (
//               <IsoForm {...props} onSubmit={onSubmit}>
//                 {state.errors.map(e => e.message).join(", ")}
//                 {props.children}
//               </IsoForm>
//             );
//         }
//       }}
//     </MutationWrapper>
//   );
// }
