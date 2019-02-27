import * as React from "react";

export const AnaltyicsContext = React.createContext<{ engine: any }>({
  engine: null,
});

export const AnalyticsProvider = AnaltyicsContext.Provider;

type SomeEvent = { category: "SomeCategory"; action: "meow" | "boo" };
type Event = { label?: string } & (SomeEvent);

export function useAnalytics() {
  const context = React.useContext(AnaltyicsContext);

  return React.useCallback(
    (event: Event) => {
      if (context.engine !== null) {
        context.engine(
          "send",
          "event",
          event.category,
          event.action,
          event.label
        );
      }
    },
    [context.engine]
  );
}
