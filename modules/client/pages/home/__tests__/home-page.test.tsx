import { mockProvider } from "client/test-helpers/mock-apollo";
import { mount } from "enzyme";
import * as React from "react";
import { HomePage } from "client/pages/home";
import { SnackVoterEntry } from "client/components/snack-voter";
import { MockList } from "graphql-tools";
import { sleep } from "helpers";
import * as State from "client/state";

describe("Home page", () => {
  it("Begins in a loading state", () => {
    const Provider = mockProvider();

    const page = mount(
      <Provider>
        <HomePage />
      </Provider>
    );

    expect(page.text()).toContain("Loading");
  });

  it("Shows a message if there are no snacks", async () => {
    const Provider = mockProvider({
      mocks: {
        Query: () => ({
          allSnacks: () => new MockList(0)
        })
      }
    });

    const page = mount(
      <Provider>
        <HomePage />
      </Provider>
    );

    await sleep(0);

    expect(page.text()).toContain("no snacks");
  });

  it("Shows snacks in a list", async () => {
    const Provider = mockProvider({
      mocks: {
        Query: () => ({
          allSnacks: () => [
            { id: 1, name: "Foo", voteCount: 1 },
            { id: 2, name: "Bar", voteCount: 2 }
          ]
        })
      }
    });

    const page = mount(
      <Provider>
        <HomePage />
      </Provider>
    );

    await sleep(0);

    expect(page.text()).toMatch("Foo");
    expect(page.text()).toMatch("Bar");
  });

  it("Lets the user toggle popularity mode", async () => {
    const Provider = mockProvider({
      initState: state =>
        State.popularityMode.set(state, State.PopularityMode.PERCENTAGE),

      mocks: {
        Query: () => ({
          allSnacks: () => [
            { id: 1, name: "Foo", voteCount: 1 },
            { id: 2, name: "Bar", voteCount: 2 }
          ]
        })
      }
    });

    const page = mount(
      <Provider>
        <HomePage />
      </Provider>
    );

    await sleep(0);

    page.update();
    const toggles = page.find(SnackVoterEntry);
    const fooToggle = toggles.filterWhere(e => e.text().includes("Foo"));
    const barToggle = toggles.filterWhere(e => e.text().includes("Bar"));

    expect(fooToggle.text()).toMatch("50%");
    expect(barToggle.text()).toMatch("100%");

    page.find("#home-page-vote-count").simulate("change");

    expect(fooToggle.text()).toMatch("1 votes");
    expect(barToggle.text()).toMatch("2 votes");
  });
});
