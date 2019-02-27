declare module "@storybook/addon-viewport" {
  const viewPortTypes =
    string |
    {
      onViewportChange({}) {},
    };
  function withViewport(param?: viewPortTypes): StorybookDecorator;

  type ViewportKeys =
    | "responsive"
    | "iphone5"
    | "iphone6"
    | "iphone6p"
    | "iphone8p"
    | "iphonex"
    | "iphonexr"
    | "iphonexsmax"
    | "ipad"
    | "ipad10p"
    | "ipad12p"
    | "galaxys5"
    | "galaxys9"
    | "nexus5x"
    | "nexus6p"
    | "pixel"
    | "pixelxl";

  const INITIAL_VIEWPORTS: {
    [k in ViewportKeys]: {
      name: string;
      styles: any;
      type: "desktop" | "mobile";
    }
  };
}
