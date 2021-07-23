import React from "react";

export default function Pozicija2(props) {
  return (
    <div className="field">
      <select
        id="pozicija2"
        className="form-control"
        name="pozicija2"
        onChange={props.onChange}
        value={props.pozicija}
      >
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
