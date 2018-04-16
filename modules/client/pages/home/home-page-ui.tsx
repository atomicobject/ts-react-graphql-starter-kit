import * as React from "react";
import { SnackVoter, SnackVoterProps } from "client/components/snack-voter";
import { PopularityMode } from "client/state";
import { PopularitySelector } from "client/pages/home/popularity-selector";

require("./styles.scss");

export interface HomePageUIProps {
  readonly snacks: SnackVoterProps["snacks"];
  readonly onVote: SnackVoterProps["onVote"];
  readonly popularityMode: PopularityMode;
  readonly onPopularityModeChange: (mode: PopularityMode) => void;
}

export const HomePageUI: React.SFC<HomePageUIProps> = props => {
  const { snacks, onVote, popularityMode, onPopularityModeChange } = props;
  return (
    <div className="home-page">
      <h2>Snacks</h2>
      <SnackVoter
        snacks={snacks}
        onVote={onVote}
        popularityMode={popularityMode}
      />

      <PopularitySelector
        selected={popularityMode}
        onChange={onPopularityModeChange}
      />
    </div>
  );
};
