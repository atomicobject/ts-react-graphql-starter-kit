import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "client/styles";
import { Translation } from "client/translations";
import * as React from "react";
import { Link } from "react-router-dom";

export function AppHeader() {
  const classes = useStyles();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Link to="/" className={classes.header}>
            <Typography variant="h6" color="inherit">
              <Translation tag="header.productTitle" />
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacerClass} />
    </>
  );
}

const useStyles = makeStyles(theme => ({
  appBarSpacerClass: theme.mixins.toolbar,
  header: {
    textDecoration: "inherit",
    color: "inherit",
    flexGrow: 1,
  },
}));
