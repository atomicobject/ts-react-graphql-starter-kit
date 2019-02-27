import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { LocationDescriptor } from "history";
import * as React from "react";
import { Link } from "react-router-dom";

export interface Props {
  buttonProps?: ButtonProps;
  children: React.ReactNode;
  to: LocationDescriptor;
  replace?: boolean;
}

export function ButtonLink(props: Props) {
  return (
    <Button
      {...props.buttonProps}
      component={linkProps => (
        <Link to={props.to} replace={props.replace} {...linkProps as any} />
      )}
    >
      {props.children}
    </Button>
  );
}
