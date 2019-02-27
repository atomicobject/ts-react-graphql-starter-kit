import { getTranslation, I18nMap } from "atomic-object/i18n";
import * as React from "react";

export function buildComponents<Props>(defaultValue: I18nMap<Props>) {
  const TranslationContext = React.createContext<I18nMap<Props>>(defaultValue);

  const TranslationProvider = TranslationContext.Provider;

  function useTranslator() {
    const context = React.useContext(TranslationContext);

    return React.useCallback(
      (props: Props) =>
        getTranslation(context, (props as any).tag, (props as any).vars),
      [context]
    );
  }

  const Translation: React.SFC<Props> = (props: any) => {
    const translator = useTranslator();
    return <>{translator(props)}</>;
  };

  return {
    Translation,
    TranslationProvider,
    useTranslator,
  };
}
