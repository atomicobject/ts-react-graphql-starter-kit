import * as React from "react";
import { graphql } from "react-apollo";
import { AnswerQuery } from "../../graphql-types";

interface DisplayProps {
  answer: number[];
}
function PureDisplay(props: DisplayProps) {
  return (
    <div>
      <p>The answer is:</p>
      <ul>
        {props.answer.map(n =>
          <li key={n}>
            {n}
          </li>
        )}
      </ul>
    </div>
  );
}

const wireToApollo = graphql<
  AnswerQuery,
  {},
  DisplayProps
>(require("../../sagas/Answer.graphql"), {
  alias: "AnswerDisplay",
  options: { fetchPolicy: "network-only" },
  props: resp => {
    if (!resp.data || resp.data.loading) {
      return { answer: [] };
    }
    return { answer: resp.data.game.answer };
  }
});

export const AnswerDisplay = wireToApollo(PureDisplay);
