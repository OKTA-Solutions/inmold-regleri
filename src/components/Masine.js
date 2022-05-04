import React from "react";

export default function Masine(props) {
  return (
    <div className="field">
      <select
        id="masine"
        className="form-control"
        name="masine"
        onChange={props.onChange}
        value={props.masina}
        disabled={props.disabled}
      >
        {props.masine.map((masina) => {
          return (
            <option key={masina.id_masine} value={masina.id_masine}>
              {masina.naziv_masine}
            </option>
          );
        })}
      </select>
    </div>
  );
}
