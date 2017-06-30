import * as React from "react";
import { storiesOf } from "@storybook/react";
const { action } = require("@storybook/addon-actions");

import { RedBox } from ".";

import "./styles.scss";

storiesOf("RedBox", module)
  .add("with text", () =>
    <button onClick={action("clicked")}>Hello Button</button>
  )
  .add("simple", () => <RedBox>yo</RedBox>);
// .add("with some emoji", () =>
//   <button onClick={action("clicked")}>😀 😎 👍 💯</button>
// );
