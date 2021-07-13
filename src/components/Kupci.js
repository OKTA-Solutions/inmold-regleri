import React from "react";

export default function Kupci(props) {
  return (
    <div className="field">
      <select
        id="kupci"
        className="form-control"
        name="kupci"
        onChange={props.onChange}
      >
        {props.kupci.map((kupac) => {
          return (
            <option key={kupac.id_partnera} value={kupac.id_partnera}>
              {kupac.kupac}
            </option>
          );
        })}
      </select>
    </div>
  );
}
