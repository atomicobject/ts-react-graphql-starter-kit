import { I18nProps, useTranslator } from "client/translations";
import { Field, FieldAttributes, useField } from "formik";
import * as FMUI from "formik-material-ui";

import * as React from "react";

export type CheckBoxProps = {
  name: string;
  translation?: I18nProps;
} & FieldAttributes<{}>;
/** A thin wrapper around Material UI TextField supporting Formik and translations. */
export const CheckBox: React.SFC<CheckBoxProps> = props => {
  const i18n = useTranslator();

  return props.translation ? (
    <Field
      component={FMUI.CheckboxWithLabel}
      Label={{ label: i18n(props.translation) }}
      {...props}
    />
  ) : (
    <Field component={FMUI.Checkbox} {...props} />
  );
};
