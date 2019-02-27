type Result<T, E extends Error> = T | E;

export type Type<T, E extends Error = Error> = Result<T, E>;

export function isError<T, E extends Error>(result: Result<T, E>): result is E {
  return result instanceof Error;
}

export function isResult<T, E extends Error>(
  result: Result<T, E>
): result is T {
  return !isError(result);
}

export function toException<T, E extends Error>(result: Result<T, E>): T {
  if (isError(result)) {
    throw result;
  }
  return result;
}
