import InfiniteLoaderType from "react-window-infinite-loader";
const UntypedLoader = require("react-window-infinite-loader");

export const InfiniteLoader: typeof InfiniteLoaderType =
  "default" in UntypedLoader ? UntypedLoader.default : UntypedLoader;
