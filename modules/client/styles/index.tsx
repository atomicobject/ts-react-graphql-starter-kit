import { Theme } from "@material-ui/core";
import * as MUIStyles from "@material-ui/styles";
import { CSSProperties } from "jss/css";
import { WithStylesOptions } from "@material-ui/styles/withStyles";

/*

I have some problems with material-ui's types for their styles library.

1. I want to patch it to force use of our custom theme type
2. Their type definitions force your code to provide an empty object to
   useStyles in cases where you have no props. E.g., useStyles({});
3. Their types let too many anys through, so TypeScript can't check your
   CSS properties as thoroughly.
   
To address these issues, I've defined our own makeStyles() hook here.

*/

export type StyleRules<
  Props extends object | void,
  ClassKey extends string = string
> = Record<ClassKey, CSSProperties | ((props: Props) => CSSProperties)>;

export type StyleRulesCallback<
  Props extends object | void,
  ClassKey extends string = string
> = (theme: Theme) => StyleRules<Props, ClassKey>;

export type StyleSheet<K extends string, P extends object | void> =
  | StyleRules<P, K>
  | StyleRulesCallback<P, K>;

export type StyleRulesWithProps<ClassNames extends string, Props> = Record<
  ClassNames,
  ((p: Props) => CSSProperties) | CSSProperties
>;

export type StyleRulesCallbackWithProps<ClassKeys extends string, Props> = (
  theme: Theme
) => StyleRulesWithProps<ClassKeys, Props>;

export type StyleSheetWithProps<ClassKeys extends string, Props> =
  | StyleRulesWithProps<ClassKeys, Props>
  | StyleRulesCallbackWithProps<ClassKeys, Props>;

export function makeStyles<ClassKeys extends string, Props extends void>(
  styles: StyleSheet<ClassKeys, void>,
  options?: WithStylesOptions
): () => { [k in ClassKeys]: string };

export function makeStyles<ClassKeys extends string, Props extends object>(
  styles: StyleSheetWithProps<ClassKeys, Props>,
  options?: WithStylesOptions
): (props: Props) => { [k in ClassKeys]: string };

export function makeStyles(s: any, t: any): any {
  /*
  Jest tests use jsdom internally, which has a weak CSS parser that can choke
  on modern CSS features. In particular we ran into this with media queries:

  > Error: Could not parse CSS stylesheet

  https://github.com/jsdom/jsdom/issues/2177

  So, for now, we're withholding component styles when under test.
*/
  let maybeStyles = __TEST__ ? {} : s;
  return MUIStyles.makeStyles(maybeStyles, t) as any;
}
