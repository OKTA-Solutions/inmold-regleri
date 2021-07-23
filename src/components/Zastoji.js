import React from "react";

function Zastoji(props) {
  return (
    <div className="field">
      <select
        id="zastoj"
        className="form-control"
        name="zastoj"
        onChange={props.onChange}
        value={props.zastoj}
      >
        {props.zastoji.map((z) => {
          return (
            <option key={z.id_zastoja} value={z.id_zastoja}>
              {z.sifra_prikaz}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Zastoji;
