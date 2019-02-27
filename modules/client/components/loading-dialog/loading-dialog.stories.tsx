import * as React from "react";
import { storiesOf } from "@storybook/react";
import { LoadingDialog } from ".";

storiesOf("Components/Loading Dialog", module).add(
  "Default loading",
  () => {
    return <LoadingDialog open={true} />;
  }
).add(
  "Loading with custom header",
  () => {
    return <LoadingDialog open={true} header={<div>This is a custom header</div>} />;
  }
);
