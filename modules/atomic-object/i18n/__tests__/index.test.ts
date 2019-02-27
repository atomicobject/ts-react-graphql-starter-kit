import { I18nProfile, getTranslation } from "..";

describe("isValidI18nMap", () => {
  it("detects a missing entry on a flat profile", () => {
    const flatProfile = I18nProfile.with("foo").with("bar");
    expect(
      flatProfile.isValidI18nMap({
        foo: "asdf",
      })
    ).toBe(false);
  });

  it("detects a missing entry on a nested profile", () => {
    const nestedProfile = I18nProfile.with("foo.bar").with("foo.baz");
    expect(
      nestedProfile.isValidI18nMap({
        foo: {
          baz: "value",
        },
      })
    ).toBe(false);
  });

  it("detects undeclared variables", () => {
    const nestedProfile = I18nProfile.with("foo.baz");
    expect(
      nestedProfile.isValidI18nMap({
        foo: {
          baz: "value {var}",
        },
      })
    ).toBe(false);
  });

  it("detects undeclared variables when some are declared", () => {
    const nestedProfile = I18nProfile.with("foo.baz", "x");
    expect(
      nestedProfile.isValidI18nMap({
        foo: {
          baz: "value {var} {x}",
        },
      })
    ).toBe(false);
  });

  it("does not flag valid use with one variable", () => {
    const nestedProfile = I18nProfile.with("foo.baz", "x");
    expect(
      nestedProfile.isValidI18nMap({
        foo: {
          baz: "value {x}",
        },
      })
    ).toBe(true);
  });

  it("does not flag valid use with multiple variables", () => {
    const nestedProfile = I18nProfile.with("foo.baz", ["x", "y"]);
    expect(
      nestedProfile.isValidI18nMap({
        foo: {
          baz: "value {x} {y}",
        },
      })
    ).toBe(true);
  });
});

describe("getTranslation", () => {
  it("gets the translation for a single tag", () => {
    const translations: any = {
      welcome: "words",
    };
    const translation = getTranslation(translations, "welcome", {});
    expect(translation).toBe("words");
  });

  it("gets the translation for a tag and a var", () => {
    const translations: any = {
      welcome: "hello {name}!",
    };
    const translation = getTranslation(translations, "welcome", {
      name: "Drew",
    });
    expect(translation).toBe("hello Drew!");
  });

  it("gets the translation for a tag and several vars", () => {
    const translations: any = {
      welcome: "hello {name} and {other}!",
    };
    const translation = getTranslation(translations, "welcome", {
      name: "Drew",
      other: "Rachael",
    });
    expect(translation).toBe("hello Drew and Rachael!");
  });

  it("throws an exception if there is a missing var", () => {
    const translations: any = {
      welcome: "hello {name}!",
    };
    expect(() =>
      getTranslation(translations, "welcome", { wizard: "Drew" })
    ).toThrow();
  });

  it("throws an exception if there is a missing tag", () => {
    const translations: any = {
      welcome: "hello {name}!",
    };
    expect(() =>
      getTranslation(translations, "nonsense", { name: "Drew" })
    ).toThrow();
  });

  it("supports nested definitions", () => {
    const translations: any = {
      all: {
        messages: {
          welcome: "hello {name}!",
        },
        something: "else",
      },
    };
    const translation = getTranslation(translations, "all.messages.welcome", {
      name: "Drew",
    });
    expect(translation).toBe("hello Drew!");
  });
});

// describe('parse', () => {
//   it('gets the translation map out of a yaml file', () => {
//     const translationMap = parse();
//     // expect
//   })
//   it('throws an error if the translations in the file are not in the translation profile', () => {
//     ??
//     expect(parse(??)).toThrow();
//   })
// });
