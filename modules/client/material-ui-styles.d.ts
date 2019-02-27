declare module "@material-ui/styles" {
  function install();
  declare const ThemeProvider: React.ComponentType<{ theme: Theme }>;
}

declare module "@material-ui/core/useMediaQuery" {
  export interface Options {
    defaultMatches?: boolean;
    matchMedia?: (query: string) => MuiMediaQueryList;
  }
  declare function unstable_useMediaQuery(
    query: string,
    options?: Options
  ): boolean;
}
