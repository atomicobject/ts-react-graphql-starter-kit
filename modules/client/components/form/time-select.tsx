import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  FormHelperText,
} from "@material-ui/core";
import { I18nProps, useTranslator } from "client/translations";
import * as TimeIso from "core/time-iso";
import { range } from "lodash-es";
import * as React from "react";
import { Field } from "formik";
import { SelectProps } from "@material-ui/core/Select";
import { makeStyles } from "client/styles";

export type TimeSelectProps = {
  translation: I18nProps;
  field: {
    name: string;
    value: TimeIso.Type;
    onChange: (e: React.ChangeEvent<any>) => void;
  };
  form: any;
} & SelectProps;

/** A select box wrapper with an hour field and a minute field */
const TimeSelectUI: React.SFC<TimeSelectProps> = props => {
  const i18n = useTranslator();
  const classes = useStyles();

  const nullTimes = !props.field.value;

  const date = TimeIso.parse(props.field.value);
  const minute = date.getMinutes();
  const hour = date.getHours();

  const handleHoursChange = React.useCallback(
    (event: any) => {
      const updatedTime = TimeIso.from(event.target.value, minute);
      props.form.setFieldValue(props.field.name, updatedTime);
    },
    [props.field.name, minute]
  );

  const handleMinutesChange = React.useCallback(
    (event: any) => {
      const updatedTime = TimeIso.from(hour, event.target.value);
      props.form.setFieldValue(props.field.name, updatedTime);
    },
    [props.field.name, hour]
  );

  const hours1 = range(1, 10);
  const hours2 = range(10, 25);
  const minutes1 = range(0, 10);
  const minutes2 = range(10, 60);

  return React.useMemo(() => {
    return (
      <FormControl error={props.form.errors[props.field.name] && true}>
        <Grid container className={props.readOnly ? classes.readOnly : ""}>
          <Grid item>
            <InputLabel
              htmlFor={props.field.name}
              shrink={nullTimes || undefined}
            >
              {i18n(props.translation)}
            </InputLabel>
            <Select
              value={nullTimes ? "" : hour}
              onChange={handleHoursChange}
              {...props}
            >
              {hours1.map(h => {
                return (
                  <MenuItem key={h} value={h}>
                    {TimeIso.toHoursAmPm(`0${h}:00`)}
                  </MenuItem>
                );
              })}
              {hours2.map(h => {
                return (
                  <MenuItem key={h} value={h}>
                    {TimeIso.toHoursAmPm(`${h}:00`)}
                  </MenuItem>
                );
              })}
            </Select>
            <Select
              value={nullTimes ? "" : minute}
              onChange={handleMinutesChange}
              {...props}
            >
              {minutes1.map(m => (
                <MenuItem key={m} value={m}>
                  {TimeIso.toMinutes(`00:0${m}`)}
                </MenuItem>
              ))}
              {minutes2.map(m => (
                <MenuItem key={m} value={m}>
                  {TimeIso.toMinutes(`00:${m}`)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <FormHelperText>{props.form.errors[props.field.name]}</FormHelperText>
      </FormControl>
    );
  }, [minute, hour, props.form.errors[props.field.name]]);
};

export const TimeSelect: React.SFC<
  {
    name: string;
    translation: I18nProps;
  } & SelectProps
> = props => {
  return <Field component={TimeSelectUI} {...props} />;
};

const useStyles = makeStyles(theme => ({
  readOnly: {
    pointerEvents: "none" as "none",
  },
}));
