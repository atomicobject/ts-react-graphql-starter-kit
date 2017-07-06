import * as Nightmare from "nightmare";

export function withBrowser(
  func: (b: Nightmare) => Promise<any>
): () => Promise<any> {
  return async () => {
    const b = new Nightmare({ show: false });
    try {
      await func(b);
    } finally {
      await b.end();
    }
  };
}
