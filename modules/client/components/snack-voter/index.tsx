import * as React from "react";
import { SnackId } from "records/snack-record";
import partial from "lodash-es/partial";
import { PopularityMode } from "client/state";

export type SnackVoteInfo = {
  readonly id: SnackId;
  readonly name: string;
  readonly voteCount: number;
};
export interface SnackVoterProps {
  readonly popularityMode: PopularityMode;
  readonly snacks: null | ReadonlyArray<SnackVoteInfo>;
  readonly onVote: (snack: SnackVoteInfo) => void;
}

export const calcPopularityPercentage = (
  snackVotes: number,
  maxVotes: number
): string => {
  const percentage =
    maxVotes <= 0 ? 100 : Math.round(100.0 * snackVotes / maxVotes);
  return `${percentage}%`;
};

export interface SnackVoterEntryProps {
  name: string;
  popularityDesc: string;
  onVote: () => void;
}

export const SnackVoterEntry: React.SFC<SnackVoterEntryProps> = props => (
  <li>
    {props.name}&nbsp; (popularity: {props.popularityDesc})&nbsp;
    <a onClick={props.onVote}>Vote</a>
  </li>
);

export const SnackVoter: React.SFC<SnackVoterProps> = props => {
  const { snacks, onVote, popularityMode } = props;

  const calcPopularity =
    popularityMode === PopularityMode.PERCENTAGE
      ? calcPopularityPercentage
      : (count: number) => `${count} votes`;

  let voteRows: JSX.Element | JSX.Element[];
  if (snacks === null) {
    voteRows = <li>Loading</li>;
  } else if (snacks.length === 0) {
    voteRows = <li>There are no snacks in the system</li>;
  } else {
    const maxVotes = Math.max(...snacks.map(x => x.voteCount));
    voteRows = snacks.map((snack, idx) => {
      const popularity = calcPopularity(snack.voteCount, maxVotes);
      return (
        <SnackVoterEntry
          key={idx}
          name={snack.name}
          popularityDesc={popularity}
          onVote={partial(onVote, snack)}
        />
      );
    });
  }

  return <ul>{voteRows}</ul>;
};
