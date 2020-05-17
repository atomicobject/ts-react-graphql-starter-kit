import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { ENGLISH, TranslationProvider } from "client/translations";
import * as React from "react";
import { PlacementTheme } from "../../styles/mui-theme";

export function AppShell(props: { children: JSX.Element }) {
  const { children } = props;
  return (
    <TranslationProvider value={ENGLISH}>
      <ThemeProvider theme={PlacementTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </TranslationProvider>
  );
}
