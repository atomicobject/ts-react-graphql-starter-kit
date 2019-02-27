import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ButtonLink } from ".";
import { mockProvider } from "client/test-helpers/mock-provider";

const Provider = mockProvider({});

storiesOf("Components/Button Link", module)
  .add("Button Link no button props", () => {
    return (
      <Provider>
        <ButtonLink to="/somewhere/">This is a button</ButtonLink>
      </Provider>
    );
  })
  .add("Button Link with replace", () => {
    return (
      <Provider>
        <ButtonLink to="/somewhere/" replace={true}>
          This is a button
        </ButtonLink>
      </Provider>
    );
  })
  .add("Button Link with button props", () => {
    return (
      <Provider>
        <ButtonLink buttonProps={{ variant: "contained" }} to="/somewhere/">
          This is a button
        </ButtonLink>
      </Provider>
    );
  });
