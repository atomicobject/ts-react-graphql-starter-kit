import { HomePage } from "client/pages/home";
import { mockProvider } from "client/test-helpers/mock-provider";
import { mount } from "enzyme";
import { sleep } from "helpers";
import * as React from "react";

describe("Home page", () => {
  it("Begins in a loading state", async () => {
    const Provider = mockProvider({
      mocks: {
        Query: () => ({
          localName: () => "Liz",
          testFirstEmployee: () => ({ id: 1 }),
          testFirstSubstitute: () => ({ id: 1 }),
        }),
      },
    });

    const page = mount(
      <Provider>
        <HomePage />
      </Provider>
    );

    await sleep(0);
    page.update();

    expect(page.text()).toContain("This page will eventually be replaced");
  });
});
