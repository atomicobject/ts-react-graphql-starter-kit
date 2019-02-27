import "client/bootstrap-mui"; // this must be the first import
import {
  withTheme
} from "../modules/client/storybook-decorators";
const {
  configure,
  addDecorator
} = require("@storybook/react");

addDecorator(withTheme);

function loadStories() {
  require("../modules/client/stories.ts");
  // You can require as many stories as you need.
}

configure(loadStories, module);