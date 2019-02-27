import * as React from "react";
import { storiesOf } from "@storybook/react";
import { mockProvider } from "client/test-helpers/mock-provider";
import { ErrorBoundary } from ".";

const Provider = mockProvider({});

storiesOf("Components/Error Boundary", module).add(
  "Default Error Boundary",
  () => {
    return (
      <Provider>
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      </Provider>
    );
  }
);

function ErrorComponent() {
  throw new Error("error");
  return <></>;
}
