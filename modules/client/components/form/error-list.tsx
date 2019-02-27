import { FunctionComponent, Fragment } from "react";
import * as React from "react";
import { Typography } from "@material-ui/core";
import { Copy } from "client/components/copy";
import { MutationFormState } from "atomic-object/forms/use-mutation-form";
import { I18nProps } from "client/translations";

export const MutationFormSubmissionErrors: FunctionComponent<{
  state: MutationFormState;
  message: I18nProps;
}> = props => {
  const { state } = props;
  if (state.key !== "ERROR") {
    return <Fragment />;
  }
  return (
    <div>
      <p>
        <Copy {...props.message} variant="body1" />
        <ul>
          {state.errors.map((e, i) => (
            <li key={e.name}>
              <Typography variant="body1">{e.message}</Typography>
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
};
