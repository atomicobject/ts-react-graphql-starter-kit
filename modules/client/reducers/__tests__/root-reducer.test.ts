import { rootReducer } from "client/reducers";
import * as State from "client/state";
import * as Actions from "client/actions";
import { PopularityMode } from "client/state";

describe("the app root reducer", () => {
  it("can set the popularity", () => {
    const PM = PopularityMode;

    expect(State.popularityMode(State.DEFAULT)).toEqual(PM.PERCENTAGE);
    const countState = rootReducer(
      State.DEFAULT,
      Actions.setPopularity(PM.VOTE_COUNT)
    );

    expect(State.popularityMode(countState)).toEqual(PM.VOTE_COUNT);

    const percentageState = rootReducer(
      countState,
      Actions.setPopularity(PM.PERCENTAGE)
    );
    expect(State.popularityMode(percentageState)).toEqual(PM.PERCENTAGE);
  });
});
