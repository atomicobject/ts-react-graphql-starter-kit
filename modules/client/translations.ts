import { I18nProfile, MapOf, PropsOf } from "atomic-object/i18n";
import { buildComponents } from "atomic-object/i18n/component";

export const I18n = I18nProfile.with("header.productTitle")
  .with("core.cancel")
  .with("core.accept")
  .with("core.loading")
  .with("core.getMeOutOfHere")
  .with("core.somethingWentWrong")
  .with("core.takeMeBack")
  .with("core.404NotFound")
  .with("core.contactUsAt", "email")
  .with("core.unknownUser");

export type I18nProps = PropsOf<typeof I18n>;
export type I18nMap = MapOf<typeof I18n>;

export const ENGLISH = I18n.verifyI18nMap(require("./en-US.json"));

export const {
  Translation,
  TranslationProvider,
  useTranslator,
} = buildComponents(ENGLISH);

export type Translator = ReturnType<typeof useTranslator>;
