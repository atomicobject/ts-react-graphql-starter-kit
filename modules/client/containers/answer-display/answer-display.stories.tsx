import * as React from "react";
import { storiesOf } from "@storybook/react";

import { AnswerDisplay } from ".";

import { WithNotes } from "@storybook/addon-notes";
import { mockProvider } from "../../test-helpers/mock-apollo";

storiesOf(
  "AnswerDisplay",
  module
).addWithInfo(
  "Can show an Answer from the server",
  `This story demonstrates how to mock a query
  in apollo.

  The mock answer function provides the code shown in the component.
  `,
  () => {
    const code = [3, 2, 1];
    const Provider = mockProvider({
      mocks: {
        Query: () => ({
          game: { answer: code }
        })
      }
    });
    return (
      <WithNotes notes={`The code should be ${code.join(", ")}`}>
        <Provider>
          <AnswerDisplay />
        </Provider>
      </WithNotes>
    );
  }
);
// .add("with some emoji", () =>
//   <button onClick={action("clicked")}>😀 😎 👍 💯</button>
// );
