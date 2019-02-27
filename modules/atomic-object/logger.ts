import * as ErrorNotifier from "atomic-object/error-notifier";

let notifyRollbarThreshold = ErrorNotifier.ErrorLevel.error;

export enum ErrorLevel {
  critical = "critical",
  error = "error",
  warning = "warning",
  info = "info",
  debug = "debug",
}

const rankedErrorLevels: ErrorLevel[] = [
  ErrorLevel.debug,
  ErrorLevel.info,
  ErrorLevel.warning,
  ErrorLevel.error,
  ErrorLevel.critical,
];
export function makeWrapper(level: ErrorLevel): (...messages: any[]) => void {
  return (...messages) => {
    if (!__TEST__) {
      logByLevel(level, ...messages);
    }
    if (
      rankedErrorLevels.indexOf(level) >=
      rankedErrorLevels.indexOf(notifyRollbarThreshold)
    ) {
      ErrorNotifier[level].apply(ErrorNotifier, messages);
    }
  };
}

function logByLevel(level: ErrorLevel, ...message: any[]) {
  switch (level) {
    case ErrorLevel.debug:
      if (process.env.NODE_ENV !== "production") {
        console.log(...message);
      }
      break;
    case ErrorLevel.info:
      console.log(...message);
      break;
    case ErrorLevel.warning:
      console.warn(...message);
      break;
    case ErrorLevel.error:
    case ErrorLevel.critical:
      console.error(...message);
      break;
  }
}

export const critical = makeWrapper(ErrorLevel.critical);
export const error = makeWrapper(ErrorLevel.error);
export const warning = makeWrapper(ErrorLevel.warning);
export const info = makeWrapper(ErrorLevel.info);
export const debug = makeWrapper(ErrorLevel.debug);
