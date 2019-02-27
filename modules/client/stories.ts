import { addDecorator } from "@storybook/react";
import "./components/button-link/button-link-stories";
import "./components/error/error.stories";
import "./components/error-boundary/error-boundary.stories";
import "./components/loading-dialog/loading-dialog.stories.tsx";
import "./pages/home/home-page-ui.stories";
import { withI18n } from "./storybook-decorators";

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

addDecorator(withI18n);
