import * as React from "react";
import { useTranslator, I18nProps } from "client/translations";
import { Grid, Button } from "@material-ui/core";
import { Copy } from "../copy";
import { makeStyles } from "client/styles";

export type ErrorType = "notFound" | "unknownUser" | "serverError";
export type Props = {
  errorType: ErrorType;
};

export function ErrorComponent(props: Props) {
  const classes = useStyles();
  const translate = useTranslator();
  const errorInfo = errorPackage(props.errorType);
  const buttons = errorInfo.buttons.map(b => (
    <Button href={b.buttonHref} variant={"contained"}>
      <Copy {...b.buttonText} className={classes.copy} />
    </Button>
  ));
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      (something went wrong - translate me)
      {...buttons}
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  copy: {
    fontSize: theme.typography.pxToRem(16),
    color: theme.palette.common.white,
  },
}));

type ErrorPackage = {
  altText: I18nProps;
  buttons: ButtonPackage[];
};

type ButtonPackage = {
  buttonHref: string;
  buttonText: I18nProps;
};
function errorPackage(errorType: ErrorType): ErrorPackage {
  const translate = useTranslator();
  switch (errorType) {
    case "notFound":
      return {
        altText: { tag: "core.404NotFound" },
        buttons: [{ buttonHref: "/", buttonText: { tag: "core.takeMeBack" } }],
      };
    case "serverError":
      return {
        altText: { tag: "core.somethingWentWrong" },
        buttons: [
          { buttonHref: "/", buttonText: { tag: "core.getMeOutOfHere" } },
        ],
      };
    case "unknownUser":
      return {
        altText: { tag: "core.unknownUser" },
        buttons: [
          {
            buttonHref: process.env.IDENTITY_PROVIDER_HOST || "/",
            buttonText: { tag: "core.takeMeBack" },
          },
        ],
      };
  }
}
