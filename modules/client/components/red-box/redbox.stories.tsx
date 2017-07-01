import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { RedBox } from ".";

import { withKnobs, text } from "@storybook/addon-knobs";
import { WithNotes } from "@storybook/addon-notes";

storiesOf("RedBox", module)
  .addDecorator(withKnobs)
  .add("with text", () =>
    <WithNotes notes="A simple component which puts a red border around its contents">
      <RedBox>
        <button onClick={action("clicked")}>
          {text("inner text", "Click me")}
        </button>
      </RedBox>
    </WithNotes>
  )
  .add("simple", () => <RedBox>yo</RedBox>);
// .add("with some emoji", () =>
//   <button onClick={action("clicked")}>😀 😎 👍 💯</button>
// );
