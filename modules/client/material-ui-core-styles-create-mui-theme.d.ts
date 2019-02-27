import { Theme } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  export interface Theme {
    customColors: {
      white: string;
      grayWhite: string;
      black: string;
      blue: string;
      darkBlue: string;
      gray: string;
      darkGray: string;
      medLightGray: string;
      lightGray: string;

      raspberry: string;
      pumpkin: string;
      mustard: string;
      ocean: string;
      grape: string;
      twilight: string;
      sky: string;
      slate: string;
      tomato: string;
      grass: string;

      lightTomato: string;
      lightRaspberry: string;
      lightPumpkin: string;
      lightMustard: string;
      lightOcean: string;
      lightGrape: string;
      lightTwilight: string;
      lightSlate: string;
    };
  }
  // allow configuration using `createMuiTheme`
  export interface ThemeOptions {
    customColors?: {
      white?: string;
      grayWhite?: string;
      black?: string;
      blue?: string;
      darkBlue?: string;
      gray?: string;
      darkGray?: string;
      medLightGray?: string;
      lightGray?: string;
      raspberry?: string;
      pumpkin?: string;
      mustard?: string;
      ocean?: string;
      grape?: string;
      twilight?: string;
      sky?: string;
      slate?: string;
      tomato?: string;
      grass?: string;

      lightTomato?: string;
      lightRaspberry?: string;
      lightMustard?: string;
      lightOcean?: string;
      lightGrape?: string;
      lightTwilight?: string;
      lightSlate?: string;
    };
  }
}
