// Fill in type definition for info addon
declare module "@storybook/react" {
  interface Story {
    addWithInfo(
      storyName: string,
      storyDesc: string,
      story: RenderFunction
    ): Story;
  }
}

import "./components/red-box/redbox.stories";
import "./containers/answer-display/answer-display.stories";
