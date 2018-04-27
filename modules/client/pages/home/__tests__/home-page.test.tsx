import { mockProvider } from "client/test-helpers/mock-apollo";
import { mount } from "enzyme";
import * as React from "react";
import { HomePage } from "client/pages/home";

describe("Home page", () => {
  it("Begins in a loading state", () => {
    const Provider = mockProvider();

    const page = mount(
      <Provider>
        <HomePage />
      </Provider>
    );

    expect(page.text()).toContain("Hello");
  });
});
