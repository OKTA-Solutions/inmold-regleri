import React from "react";

export default function Pozicija1(props) {
  return (
    <div className="field">
      <select
        id="pozicija1"
        className="form-control"
        name="pozicija1"
        onChange={props.onChange}
        value={props.pozicija}
      >
        <option selected value={0}></option>
        {props.pozicije.map((pozicija) => {
          return (
            <option key={pozicija.id_artikla} value={pozicija.id_artikla}>
              {pozicija.naziv}
            </option>
          );
        })}
      </select>
    </div>
  );
}
