import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { I18nProps, useTranslator } from "client/translations";
import { Field, FieldAttributes } from "formik";
import * as FMUI from "formik-material-ui";
import * as React from "react";

export type SelectOption = { label: string; value: any };
export type SelectProps = {
  name: string;
  translation: I18nProps;
  /** A list of logical options to choose from. Required if children not provided */
  options?: SelectOption[];
  /** Children should have MenuItem to render within the Select. Required if options not provided. */
  children?: React.ReactNode;
} & FieldAttributes<{}>;

/** A thin wrapper around Material UI Select supporting Formik and translations. */
export const Select: React.SFC<SelectProps> = props => {
  const i18n = useTranslator();

  if (!props.children && !props.options) {
    throw new Error("Select must have options or children");
  }

  const menuItems =
    props.children ||
    props.options!.map(({ label, value }) => (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    ));

  return (
    <FormControl>
      <InputLabel htmlFor={props.name}>{i18n(props.translation)}</InputLabel>
      <Field component={FMUI.Select} {...props}>
        {menuItems}
      </Field>
    </FormControl>
  );
};
