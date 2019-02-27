import { Isomorphism } from "@atomic-object/lenses";
import { FormikContext, FormikHelpers } from "formik";
import * as yup from "yup";
import { Translator } from "client/translations";
import { DocumentNode } from "graphql";

export const IDENTITY_ISO: Isomorphism<any, any> = {
  from: (a: any) => a,
  to: (b: any) => b,
};

export type SubmitFn<Values> = (
  values: Values,
  formikHelpers: FormikHelpers<Values>
) => void;
export type SchemaBuilder<TFormData extends object> = (arg: {
  translator: Translator;
}) => yup.ObjectSchema<TFormData>;

export type RedirectState = { key: "REDIRECT"; to: string };
