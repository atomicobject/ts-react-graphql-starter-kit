import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import * as React from "react";
import { Copy } from "../copy";
import { makeStyles } from "client/styles";
import { DialogProps } from "@material-ui/core/Dialog";

export interface Props extends DialogProps {
  header?: JSX.Element;
}

export const LoadingDialog = React.memo(function LoadingDialog(
  props: Props
) {
  const classes = useStyles();
  return (
    <Dialog
      {...props}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      <DialogTitle>
        {props.header ? (
          props.header
        ) : (
          <Copy className={classes.header} tag={"core.loading"} />
        )}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          alignContent="center"
          alignItems="center"
          justify="center"
        >
          <CircularProgress />
        </Grid>
      </DialogContent>
    </Dialog>
  );
});

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: theme.typography.pxToRem(20),
  },
}));
