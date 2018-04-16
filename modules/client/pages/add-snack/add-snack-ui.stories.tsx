import { storiesOf } from "@storybook/react";
import * as React from "react";
import { AddSnackUI } from "./add-snack-ui";
import { action } from "@storybook/addon-actions";

storiesOf("Page – Add Snack", module).add("Simple example", () => (
  <AddSnackUI
    fields={{ name: "some snack name" }}
    onFieldChanged={action("on field change")}
    onSave={action("onSave")}
  />
));
