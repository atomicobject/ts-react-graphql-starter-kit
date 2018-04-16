import * as React from "react";
import { PopularityMode } from "client/state";

export interface Props {
  readonly selected: PopularityMode;
  readonly onChange: (mode: PopularityMode) => void;
}

export const PopularitySelector: React.SFC<Props> = props => (
  <div className="home-page-pop-mode-toggle">
    <h4>Show popularity as:</h4>
    <div>
      <label htmlFor="home-page-percentage">
        <input
          id="home-page-percentage"
          type="radio"
          checked={props.selected === PopularityMode.PERCENTAGE}
          onChange={() => props.onChange(PopularityMode.PERCENTAGE)}
        />{" "}
        Percentage
      </label>
    </div>
    <div>
      <label htmlFor="home-page-vote-count">
        <input
          id="home-page-vote-count"
          type="radio"
          checked={props.selected === PopularityMode.VOTE_COUNT}
          onChange={() => props.onChange(PopularityMode.VOTE_COUNT)}
        />{" "}
        Vote Count
      </label>
    </div>
  </div>
);
