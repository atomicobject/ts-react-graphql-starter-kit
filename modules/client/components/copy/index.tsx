import { useTranslator, I18nProps } from "client/translations";
import { Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
import { keys, pick, omit } from "lodash-es";
import * as React from "react";

const i18nkeys = ["tag", "vars"];

export function Copy(props: I18nProps & TypographyProps) {
  const translateProps = pick(props, i18nkeys);
  const typoProps = omit(props, i18nkeys);
  const translate = useTranslator();
  return (
    <Typography {...typoProps}>{translate(translateProps as any)}</Typography>
  );
}
