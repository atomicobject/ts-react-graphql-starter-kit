import { storiesOf } from "@storybook/react";
import * as React from "react";
import { SnackVoter } from "client/components/snack-voter";
import { action } from "@storybook/addon-actions";
import { PopularityMode } from "client/state";

storiesOf("Component – SnackVoter", module)
  .add("Basic percentage example", () => (
    <SnackVoter
      popularityMode={PopularityMode.PERCENTAGE}
      snacks={[
        {
          id: 1,
          name: "Guacamole",
          voteCount: 3
        },
        {
          id: 2,
          name: "Cheese platter",
          voteCount: 1
        }
      ]}
      onVote={action("voted")}
    />
  ))
  .add("Basic vote count example", () => (
    <SnackVoter
      popularityMode={PopularityMode.VOTE_COUNT}
      snacks={[
        {
          id: 1,
          name: "Guacamole",
          voteCount: 3
        },
        {
          id: 2,
          name: "Cheese platter",
          voteCount: 1
        }
      ]}
      onVote={action("voted")}
    />
  ))
  .add("Basic count example", () => (
    <SnackVoter
      popularityMode={PopularityMode.PERCENTAGE}
      snacks={[
        {
          id: 1,
          name: "Guacamole",
          voteCount: 3
        },
        {
          id: 2,
          name: "Cheese platter",
          voteCount: 1
        }
      ]}
      onVote={action("voted")}
    />
  ))
  .add("No votes", () => (
    <SnackVoter
      popularityMode={PopularityMode.PERCENTAGE}
      snacks={[
        {
          id: 1,
          name: "Guacamole",
          voteCount: 0
        },
        {
          id: 2,
          name: "Cheese platter",
          voteCount: 0
        }
      ]}
      onVote={action("voted")}
    />
  ))
  .add("No snacks", () => (
    <SnackVoter
      snacks={[]}
      onVote={action("voted")}
      popularityMode={PopularityMode.PERCENTAGE}
    />
  ));
