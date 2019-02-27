import { MuiThemeProvider } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { StoryDecorator } from "@storybook/react";
import { ENGLISH, TranslationProvider } from "client/translations";
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { PlacementTheme } from "./styles/mui-theme";

export const withTheme: StoryDecorator = s => (
  <MuiThemeProvider theme={PlacementTheme}>
    <ThemeProvider theme={PlacementTheme}>{s()}</ThemeProvider>
  </MuiThemeProvider>
);

export const withI18n: StoryDecorator = s => (
  <TranslationProvider value={ENGLISH}>{s()}</TranslationProvider>
);
