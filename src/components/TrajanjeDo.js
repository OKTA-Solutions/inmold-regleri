import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";

export default function TrajanjeDo(props) {
  return (
    <div className="field">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          //margin="normal"
          id="do"
          label="Do"
          value={props.trajanjeDo}
          onChange={props.onChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
          style={{ width: "95%", marginLeft: "5%" }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
