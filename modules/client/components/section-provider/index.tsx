import * as React from "react";
import { Section } from "client/core";

export const SectionContext = React.createContext({
  selected: null as Section,
  setSelected: (url: Section) => {},
});

export const SectionProvider = SectionContext.Provider;

export interface Props {
  selected: Section;
}

export function ActivatedSection(props: Props) {
  const context = React.useContext(SectionContext);
  React.useEffect(() => {
    context.setSelected(props.selected);
    return () => {};
  }, []);
  return null;
}
