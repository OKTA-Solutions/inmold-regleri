import React from "react";

function Smena(props) {
  return (
    <div className="field">
      <select
        id="smena"
        className="form-control"
        name="smena"
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      >
        <option value="1">Prva smena</option>
        <option value="2">Druga smena</option>
        <option value="3">Treća smena</option>
      </select>
    </div>
  );
}

export default Smena;
