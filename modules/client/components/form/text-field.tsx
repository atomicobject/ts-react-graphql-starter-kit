import { I18nProps, useTranslator } from "client/translations";
import { Field, FieldAttributes, useField } from "formik";
import * as FMUI from "formik-material-ui";

import * as React from "react";
import { makeStyles } from "client/styles";

export type TextFieldProps = {
  name: string;
  translation?: I18nProps;
} & FieldAttributes<{}>;
/** A thin wrapper around Material UI TextField supporting Formik and translations. */
export const TextField: React.SFC<TextFieldProps> = props => {
  const i18n = useTranslator();
  const classes = useStyles();

  return (
    <Field
      className={classes.alignCenter}
      component={FMUI.TextField}
      label={props.translation && i18n(props.translation)}
      {...props}
    />
  );
};

const useStyles = makeStyles(theme => ({
  alignCenter: {
    justifyContent: "center",
  },
}));
