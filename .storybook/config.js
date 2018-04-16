import { configure, setAddon } from "@storybook/react";

import infoAddon from "@storybook/addon-info";

setAddon(infoAddon);

function loadStories() {
  require("../modules/client/stories.ts");
  // You can require as many stories as you need.
}

configure(loadStories, module);
