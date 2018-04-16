import { storiesOf } from "@storybook/react";
import * as React from "react";
import { action } from "@storybook/addon-actions";
import { HomePageUI } from "./home-page-ui";
import { PopularityMode } from "client/state";

storiesOf("Page – Home", module)
  .add("Percentage", () => (
    <HomePageUI
      popularityMode={PopularityMode.PERCENTAGE}
      onPopularityModeChange={action("OnVoteCountChange")}
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
  .add("Count", () => (
    <HomePageUI
      popularityMode={PopularityMode.VOTE_COUNT}
      onPopularityModeChange={action("OnVoteCountChange")}
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
  ));
