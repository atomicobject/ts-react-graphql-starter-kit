import {
  INITIAL_VIEWPORTS,
  ViewportKeys,
  withViewport,
} from "@storybook/addon-viewport";
import { Renderable, storiesOf } from "@storybook/react";

/**Takes a description, renderable, and device sizes and renders the renderable on each device size
 * There are no type addons for the addon-viewport, so in order to use add-on viewport API, story is typed as any
 */
export function storiesWithScreenSizes(
  description: string,
  render: () => Renderable,
  devices: ViewportKeys[]
): void {
  const storyWithDecorator = storiesOf(description, module).addDecorator(
    withViewport()
  ).add as any;
  devices.map((device: ViewportKeys) =>
    storyWithDecorator(INITIAL_VIEWPORTS[device].name, render, {
      viewport: device,
    })
  );
}
