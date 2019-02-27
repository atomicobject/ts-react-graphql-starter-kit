import * as React from "react";
import { storiesOf } from "@storybook/react";
import { mockProvider } from "client/test-helpers/mock-provider";
import { ErrorComponent } from ".";

const Provider = mockProvider({});

storiesOf("Components/Error", module)
.add(
  "404 Not Found",
  () => {
    return (
      <ErrorComponent errorType="notFound" />
    );
  }
)
.add(
  "Server Error",
  () => {
    return (
      <ErrorComponent errorType="serverError" />
    );
  }
)
.add(
  "Unknown User",
  () => {
    return (
      <ErrorComponent errorType="unknownUser" />
    );
  }
);
