import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { SectionProvider } from "client/components/section-provider";
import { Section } from "client/core";
import { ENGLISH, TranslationProvider } from "client/translations";
import * as React from "react";
import { PlacementTheme } from "../../styles/mui-theme";

export function AppShell(props: { children: JSX.Element }) {
  const [select, setSelect] = React.useState(null as Section);
  const { children } = props;
  return (
    <TranslationProvider value={ENGLISH}>
      <ThemeProvider theme={PlacementTheme}>
        <CssBaseline />
        <SectionProvider
          value={{
            selected: select,
            setSelected: setSelect,
          }}
        >
          {children}
        </SectionProvider>
      </ThemeProvider>
    </TranslationProvider>
  );
}
