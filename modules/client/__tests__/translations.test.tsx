import { mount } from "enzyme";
import * as React from "react";
import {
  useTranslator,
  ENGLISH,
  TranslationProvider,
  Translation,
} from "client/translations";

describe("useTranslation", () => {
  it("Should return the translated text", () => {
    const ShowTranslation: React.SFC = () => {
      const translator = useTranslator();
      return <>{translator({ tag: "core.accept" })}</>;
    };
    const page = mount(
      <div>
        <TranslationProvider value={ENGLISH}>
          <ShowTranslation />
        </TranslationProvider>
      </div>
    );
    expect(page.text()).toMatch("Accept");
  });
});

describe("Translation", () => {
  it("Should return the translated text", () => {
    const page = mount(
      // The div is to avoid a top-level fragment
      <div>
        <Translation tag="core.accept" />
      </div>
    );

    expect(page.html()).toMatch("Accept");
  });
});
