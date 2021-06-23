import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";

export default function TrajanjeOd(props) {
  return (
    <div className="field">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          //margin="normal"
          id="od"
          label="Od"
          value={props.trajanjeOd}
          onChange={props.onChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
          style={{ width: "95%" }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
