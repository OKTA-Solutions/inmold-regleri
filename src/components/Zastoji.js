import React from "react";

function Zastoji(props) {
  return (
    <div className="field">
      <select
        id="zastoj"
        className="form-control"
        name="zastoj"
        onChange={props.onChange}
        value={props.zastoj.id_zastoja}
      >
        {props.zastoj.map((z) => {
          return (
            <option key={z.id_zastoja} value={z.id_zastoja}>
              {z.naziv_tipa_zastoja}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Zastoji;
