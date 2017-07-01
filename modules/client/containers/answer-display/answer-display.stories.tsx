import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { AnswerDisplay } from ".";

import { withKnobs, text } from "@storybook/addon-knobs";
import { WithNotes } from "@storybook/addon-notes";
import { mockProvider } from "../../test-helpers/mock-apollo";

storiesOf("AnswerDisplay", module).add("Can be played", () => {
  const code = [3, 2, 1];
  const Provider = mockProvider({
    mocks: {
      Query: () => ({
        answer: () => code
      })
    }
  });
  return (
    <WithNotes notes={`The code should be ${code.join(", ")}`}>
      <Provider><AnswerDisplay /></Provider>
    </WithNotes>
  );
});
// .add("with some emoji", () =>
//   <button onClick={action("clicked")}>😀 😎 👍 💯</button>
// );
