import * as React from "react";
import { AddSnackUI, AddSnackUIProps, AddSnackFields } from "./add-snack-ui";
import { withApollo } from "react-apollo";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ApolloClient } from "apollo-client";
import { addSnackMutation } from "client/graphql-mutations/add-snack-mutation";

export interface ConnectedProps {
  readonly client: ApolloClient<any>;
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: ConnectedProps
): {} {
  return {
    onSubmit(form: CompletedForm) {
      addSnackMutation(props.client, form).catch(() => {
        /* ignored */
      });
    }
  };
}

type CompletedForm = { readonly [k in AddSnackFields]: string };
type InProgressForm = Partial<CompletedForm>;
type FormState = { form: InProgressForm };
type FormProps = { onSubmit: (form: CompletedForm) => void };

function isComplete(form: InProgressForm): form is CompletedForm {
  const vals = form as any;
  return Object.values(AddSnackFields).every(
    x => vals[x] && /\S/.test(vals[x])
  );
}

class ManagedForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = { form: {} };
  }

  update = (name: AddSnackFields, value: string) => {
    this.setState({ form: { ...this.state.form, [name]: value } });
  };

  onSubmit = () => {
    const form = this.state.form;
    if (isComplete(form)) {
      this.props.onSubmit(form);
      this.setState({ form: {} });
    } else {
      alert("Finish the form");
    }
  };

  render() {
    const { form } = this.state;
    const uiProps: AddSnackUIProps = {
      onSave: this.onSubmit,
      onFieldChanged: this.update,
      fields: {
        name: form.name || ""
      }
    };
    return <AddSnackUI {...uiProps} />;
  }
}

const connected = connect(undefined, mapDispatchToProps);

export const AddSnackPage = withApollo(connected(ManagedForm as any));
