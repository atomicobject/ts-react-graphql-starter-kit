import * as Nightmare from "nightmare";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

export function withBrowser(
  func: (b: Nightmare) => Promise<any>
): () => Promise<any> {
  return async () => {
    try {
      const b = new Nightmare({ show: false });

      try {
        await func(b);
      } finally {
        await b.end();
      }
    } catch (e) {
      console.error("Got an error", e);
      throw e;
    }
  };
}
