var Rollbar = require("rollbar");

/** The rollbar access token. In the client, this will be ROLLBAR_CLIENT_ACCESS_TOKEN. See client.config.js */
let ACCESS_TOKEN: string | null = null;
export let ROLLBAR_INSTANCE: any = null;

type SetupOptions = {
  captureUncaught: boolean;
  captureUnhandledRejections: boolean;
};
export function setup(
  accessToken: string | undefined,
  opts?: Partial<SetupOptions>
) {
  const settings: SetupOptions = {
    captureUncaught: true,
    captureUnhandledRejections: true,
    ...opts,
  };
  ACCESS_TOKEN = accessToken || null;
  if (ACCESS_TOKEN) {
    ROLLBAR_INSTANCE = new Rollbar({
      accessToken,
      ...settings,
    });
  }
}

export enum ErrorLevel {
  critical = "critical",
  error = "error",
  warning = "warning",
  info = "info",
  debug = "debug",
}

export function makeWrapper(level: ErrorLevel): (...args: any[]) => void {
  if (__TEST__) {
    return () => {};
  } else {
    return (...args: any[]) => {
      if (ROLLBAR_INSTANCE) {
        ROLLBAR_INSTANCE[level].apply(ROLLBAR_INSTANCE, args);
      }
    };
  }
}

export const critical = makeWrapper(ErrorLevel.critical);
export const error = makeWrapper(ErrorLevel.error);
export const warning = makeWrapper(ErrorLevel.warning);
export const info = makeWrapper(ErrorLevel.info);
export const debug = makeWrapper(ErrorLevel.debug);
