import { storiesOf } from "@storybook/react";
import * as React from "react";
import { HomePageUI } from "./home-page-ui";
import { mockProvider } from "client/test-helpers/mock-provider";

storiesOf("Page – Home", module).add("Example", () => {
  const Provider = mockProvider({});
  return (
    <Provider>
      <HomePageUI name="Liz" currentCount={3} />
    </Provider>
  );
});
