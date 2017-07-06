import * as config from "config";
import { withBrowser } from "./helpers";

describe("a simple system test", () => {
  it(
    "has 3 guess buttons on the game page",
    withBrowser(async b => {
      await b.goto(`http://${config.get("server.publicHost")}/`).wait(100);
      await b.click("a");
      const buttonCount = await b.evaluate(
        () => document.body.querySelectorAll(".btn.guess").length
      );
      expect(buttonCount).toEqual(3);
    })
  );
});
