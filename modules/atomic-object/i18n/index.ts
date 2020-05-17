import { bomb } from "helpers";

/** Definition of a tag for a translation that has no interpolated variables. */
export interface I18nPlain<Tag extends string> {
  tag: Tag;
  vars?: {};
}

/** Definition of a tag for a translation and its interpolated variables. */
interface I18nVars<Tag extends string, Args extends string> {
  tag: Tag;
  vars: { [Arg in Args]: string };
}

/** A translation tag and variables that an I18nProfile supports. */
interface I18nProfileEntry {
  readonly tag: string;
  readonly vars: string[];
}

export const mapType: unique symbol = Symbol("__type");

type wat<TMap extends I18nMap<any>> = TMap[typeof mapType];

/** A map of nested translation tags to their translation strings for a single language. */
export interface I18nMap<TProps> {
  [mapType]: TProps;
  [k: string]: string | undefined;
}

/** The profile of all translations that an application expects. */
export class I18nProfile<TProps> {
  private profileEntries: I18nProfileEntry[];
  _propsType!: TProps;
  _mapType!: I18nMap<TProps>;

  constructor() {
    this.profileEntries = [];
  }

  with<K extends string>(k: K): I18nProfile<TProps | I18nPlain<K>>;
  with<K extends string, A extends string>(
    k: K,
    args: A
  ): I18nProfile<TProps | I18nVars<K, A>>;
  with<K extends string, A extends string>(
    k: K,
    args: [A, A]
  ): I18nProfile<TProps | I18nVars<K, A>>;
  with<K extends string, A extends string>(
    k: K,
    args: [A, A, A]
  ): I18nProfile<TProps | I18nVars<K, A>>;
  with<K extends string, A extends string>(
    k: K,
    args: [A, A, A, A]
  ): I18nProfile<TProps | I18nVars<K, A>>;
  with<K extends string, A extends string>(
    k: K,
    args: [A, A, A, A, A]
  ): I18nProfile<TProps | I18nVars<K, A>>;
  with(k: string, args?: string | string[]) {
    if (typeof args === "string") {
      args = [args];
    }
    this.profileEntries.push({
      tag: k,
      vars: args || [],
    });
    return this as any;
  }
  withProfile<OtherTProps>(
    otherTp: I18nProfile<OtherTProps>
  ): I18nProfile<TProps | OtherTProps> {
    this.profileEntries = this.profileEntries.concat(otherTp.profileEntries);
    return this;
  }

  /** Verify that the input is a valid I18nMap for this TranslationProfile,
   * and throw an exception if any errors are found. */
  verifyI18nMap(map: any): I18nMap<TProps> {
    const errors = this.checkI18nMap(map);
    if (errors.length > 0) {
      for (let problem of errors) {
        console.error(problem);
      }
      return bomb(`Invalid I18nMap. ${errors.join(", ")}`);
    }
    return map;
  }

  /** Verify that the input is a valid I18nMap for this TranslationProfile. */

  isValidI18nMap(map: any): map is I18nMap<TProps> {
    const result = this.checkI18nMap(map);
    return result.length === 0;
  }

  /** Check that the input I18nMap has a valid translation for every
   * entry in this TranslationProfile, and return a list of any failures. */
  checkI18nMap(map: I18nMap<any>): string[] {
    const errors: string[] = [];

    for (let profileEntry of this.profileEntries) {
      try {
        const dummy = profileEntry.vars.reduce(
          (obj, varName) => {
            obj[varName] = "dog";
            return obj;
          },
          {} as any
        );
        getTranslation(map, profileEntry.tag, dummy);
      } catch (e) {
        errors.push(`Problem with ${profileEntry.tag}: ${e.message}`);
      }
    }

    return errors;
  }

  static with<K extends string>(k: K): I18nProfile<I18nPlain<K>>;
  static with<K extends string, A extends string>(
    k: K,
    args: A
  ): I18nProfile<I18nVars<K, A>>;
  static with<K extends string, A extends string>(
    k: K,
    args: [A, A]
  ): I18nProfile<I18nVars<K, A>>;
  static with<K extends string, A extends string>(
    k: K,
    args: [A, A, A]
  ): I18nProfile<I18nVars<K, A>>;
  static with<K extends string, A extends string>(
    k: K,
    args: [A, A, A, A]
  ): I18nProfile<I18nVars<K, A>>;
  static with<K extends string, A extends string>(
    k: K,
    args: [A, A, A, A, A]
  ): I18nProfile<I18nVars<K, A>>;
  static with(k: string, args?: string | any[]) {
    const self: any = new I18nProfile();
    return self.with(k, args);
  }
}

export type PropsOf<TP extends I18nProfile<any>> = TP["_propsType"];
export type MapOf<TP extends I18nProfile<any>> = TP["_mapType"];

/** Retrieve the translation for the given tag and vars from this I18nMap. */
export function getTranslation<TProps>(
  translations: I18nMap<TProps>,
  tag: string,
  vars?: { [k: string]: string }
): string {
  const match = tag.match(/([\w-]+)(?:\.(.+))?/);
  if (!match) {
    throw new Error("Bad key. Must be like foo.bar.baz");
  }
  const [_, head, rest] = match;
  const template = translations[head];
  if (template === undefined) {
    throw new Error(`Tag ${tag} missing from translations file`);
  }

  if (typeof template === "string") {
    const translation = template.replace(
      /{(\w+)}/g,
      (_: string, name: string) => {
        vars = vars || {};
        const value = vars[name];
        if (value === undefined) {
          throw new Error(`Variable ${name} used in translation was not valid`);
        }
        return value;
      }
    );
    return translation;
  } else {
    return getTranslation(template, rest, vars);
  }
}

export type Translator<TP extends I18nProfile<any>> = (
  props: TP["_propsType"]
) => string;
