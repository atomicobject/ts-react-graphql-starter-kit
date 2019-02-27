import createBreakpoints, {
  BreakpointsOptions,
} from "@material-ui/core/styles/createBreakpoints";
import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme";

/*
  Material-UI's interface for defining the theme is imperfect.
  Specifically, it makes it difficult for a theme definition to reference itself
  to avoid repetition.

  I've worked around this for now by breaking definitions out into constants and
  copying some of the internals of createMuiTheme out into this file.
  (Such as pxToRem)

  Nothing from this file should be exported except PlacementTheme.
*/

/** do not export this */
const pxToRem = (size: number) => {
  const coeff = baseFontSize / 14;
  return `${(size / htmlFontSize) * coeff}rem`;
};

const smallFontSize = 12;
const baseFontSize = 14;
const htmlFontSize = 16;
const fontWeightMedium = 500;

const themeColors: Theme["customColors"] = {
  white: "#ffffff",
  grayWhite: "f7f7f7",
  black: "#262c36",
  blue: "#378ff6",
  darkBlue: "#031F3C",
  gray: "#b4b6b9",
  darkGray: "#6f6f6f",
  medLightGray: "#d8d8d8",
  lightGray: "#f4f4f4",

  raspberry: "#CC0079",
  pumpkin: "#E96B1C",
  mustard: "#CFAA2A",
  ocean: "#03A8A4",
  grape: "#B80FD5",
  twilight: "#37068F",
  sky: "#03a9f4",
  slate: "#6d6d6d",
  tomato: "#eb2626",
  grass: "#4caf50",

  lightTomato: "#FDE9E9",
  lightRaspberry: "#F9E5F1",
  lightPumpkin: "#FCF0E8",
  lightMustard: "#FAF6E9",
  lightOcean: "#E5F6F5",
  lightGrape: "#F7E7FA",
  lightTwilight: "#EAE6F3",
  lightSlate: "#F0F0F0",
};
const breakpointCustomization: BreakpointsOptions = {};
const breakpoints = createBreakpoints(breakpointCustomization);

export const PlacementTheme = createMuiTheme({
  breakpoints: breakpointCustomization,
  overrides: {
    MuiButton: {
      contained: {
        color: themeColors.white,
        backgroundColor: themeColors.sky,
      },
      outlined: {
        borderColor: themeColors.sky,
        borderWidth: pxToRem(2),
      },
    },
    MuiDialog: {
      paper: {
        [breakpoints.down("xs")]: {
          margin: pxToRem(20),
        },
      },
    },
    MuiDialogTitle: {
      root: {
        [breakpoints.down("xs")]: {
          paddingTop: pxToRem(13),
          paddingBottom: pxToRem(10),
        },
      },
    },
    MuiDialogActions: {
      root: {
        paddingRight: pxToRem(4),
      },
      action: {
        // Style the typography inside of the MuiDialogAction component
        "& p": {
          fontWeight: fontWeightMedium,
          textTransform: "uppercase" as "uppercase",
          [breakpoints.down("xs")]: {
            fontSize: pxToRem(smallFontSize),
          },
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: `${pxToRem(2)} solid ${themeColors.black}`,
      },
    },
    MuiTooltip: {
      popper: {
        opacity: 1,
      },
      tooltip: {
        backgroundColor: themeColors.white,
        color: themeColors.black,
      },
    },
  },
  palette: {
    primary: {
      main: "#123f6e",
    },
  },
  customColors: {
    ...themeColors,
  },
  typography: palette => ({
    color: themeColors.black,
    useNextVariants: true,
    fontSize: baseFontSize,
    htmlFontSize: htmlFontSize,
    button: {
      fontSize: pxToRem(16),
      fontWeight: fontWeightMedium,
      color: palette.common.white,
      textTransform: "none",
      [breakpoints.down("xs") as any]: {
        fontSize: pxToRem(12),
      },
    },
  }),
});
