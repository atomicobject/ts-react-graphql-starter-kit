const { configure, setAddon } = require("@storybook/react");

function loadStories() {
  require("../modules/client/stories.ts");
  // You can require as many stories as you need.
}

configure(loadStories, module);
