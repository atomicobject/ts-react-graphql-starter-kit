import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { RedBox } from ".";

import "./styles.scss";

storiesOf("RedBox", module)
  .add("with text", () =>
    <RedBox>
      <button onClick={action("clicked")}>Hello Button</button>
    </RedBox>
  )
  .add("simple", () => <RedBox>yo</RedBox>);
// .add("with some emoji", () =>
//   <button onClick={action("clicked")}>😀 😎 👍 💯</button>
// );
