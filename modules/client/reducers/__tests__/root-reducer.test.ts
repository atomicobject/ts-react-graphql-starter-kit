import { rootReducer } from "client/reducers";
import * as State from "client/state";

describe("the app root reducer", () => {
  it("can set the popularity", () => {
    const updatedState = rootReducer(State.DEFAULT, {
      type: "some action"
    } as any);

    expect(updatedState).toEqual(State.DEFAULT);
  });
});
