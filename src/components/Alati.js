import React from "react";

export default function Alati(props) {
  return (
    <div className="field">
      <select
        id="alati"
        className="form-control"
        name="alati"
        onChange={props.onChange}
        value={props.alat}
      >
        {props.alati.map((alat) => {
          return (
            <option key={alat.id_alata} value={alat.id_alata}>
              {alat.naziv_alata}
            </option>
          );
        })}
      </select>
    </div>
  );
}
