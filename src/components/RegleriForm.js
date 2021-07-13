import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Zastoji from "./Zastoji";
import Smena from "./Smena";
import Masine from "./Masine";
import Alati from "./Alati";
import Kupci from "./Kupci";
import TrajanjeOd from "./TrajanjeOd";
import TrajanjeDo from "./TrajanjeDo";
import { httpget, httpost } from "../api/httpHelper";
import formatDate from "./formatDate";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";

function RegleriForm(props) {
  const [zastoji, setZastoji] = useState({});
  const [zastoj, setZastoj] = useState([]);
  const [masine, setMasine] = useState([]);
  const [alati, setAlati] = useState([]);
  const [kupci, setKupci] = useState([]);
  const [trajanjeOd, setTrajanjeOd] = useState(new Date());
  const [trajanjeDo, setTrajanjeDo] = useState(new Date());

  useEffect(() => {
    (async () => {
      var response = await httpget("vrati_zastoje_cmb");
      if (response.data !== null) {
        setZastoj(response.data);
      }
      var responseMasina = await httpget("vrati_masine_cmb");
      if (responseMasina.data !== null) {
        setMasine(responseMasina.data);
      }
      var responseKupci = await httpget("vrati_kupce_za_reglere_cmb");
      if (responseKupci.data !== null) {
        setKupci(responseKupci.data);
      }
    })();
  }, []);

  function handleChange({ target }) {
    setZastoji({ ...zastoji, [target.name]: target.value });
    // proveriti da li je dobra ova funkcija, videti kako slati posle na save
  }

  function handleChangeKupac({ target }) {
    (async () => {
      var RegleriModel = {
        id_partnera: parseInt(target.value),
      };
      var responseAlati = await httpost("vrati_alate_cmb", RegleriModel);
      if (responseAlati.data !== null) {
        setAlati(responseAlati.data);
      }
    })();
  }
  function handleChangeOd(date) {
    setTrajanjeOd(date);
  }
  function handleChangeDo(date) {
    setTrajanjeDo(date);
  }

  function handleSave(e) {
    e.preventDefault();
    (async () => {
      var RegleriModel = {
        id: 0,
        id_masine: isNaN(parseInt(zastoji.masine))
          ? 0
          : parseInt(zastoji.masine),
        id_alata: isNaN(parseInt(zastoji.alati)) ? 0 : parseInt(zastoji.alati),
        id_zastoja: isNaN(parseInt(zastoji.zastoj))
          ? 0
          : parseInt(zastoji.zastoj),
        smena: isUndefined(zastoji.smena) ? "1" : zastoji.smena,
        trajanje_od: formatDate(trajanjeOd),
        trajanje_do: formatDate(trajanjeDo),
        opis: isUndefined(zastoji.opis) ? "" : zastoji.opis,
        status: 1,
      };
      var response = await httpost("iud_reglera", RegleriModel);
      if (response.data === true) {
        toast.success("Zastoj uspešno unet.");
        props.history.push("/reglerilist");
      } else {
        alert("Greška pri unosu zastoja.");
        return;
      }
    })();
  }

  return (
    <form>
      <div className="form-group">
        <label htmlFor="username">Mašina:</label>
        <Masine masine={masine} onChange={handleChange} />
        <label htmlFor="username">Kupac:</label>
        <Kupci kupci={kupci} onChange={handleChangeKupac} />
        <label htmlFor="password">Alat:</label>
        <Alati alati={alati} onChange={handleChange} />
        <label htmlFor="password">Zastoj:</label>
        <Zastoji zastoj={zastoj} onChange={handleChange} />
        <label htmlFor="password">Smena:</label>
        <Smena onChange={handleChange} />
        {/* TO-DO: Trajanje time picker OD - DO */}
        <label htmlFor="password">Trajanje:</label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TrajanjeOd trajanjeOd={trajanjeOd} onChange={handleChangeOd} />
          <TrajanjeDo trajanjeDo={trajanjeDo} onChange={handleChangeDo} />
        </div>
        <label htmlFor="password">Opis:</label>
        <div className="field">
          <textarea
            id="opis"
            type="text"
            className="form-control"
            name="opis"
            value={zastoji.opis}
            onChange={handleChange}
          />
        </div>{" "}
        <br />
        <input
          type="submit"
          value="SAČUVAJ"
          className="btn"
          style={{
            width: "100%",
            background: "#fe661d",
            color: "#fff",
            marginBottom: "10px",
          }}
          onClick={handleSave}
        />
        <Link
          to="reglerilist"
          className="btn btn-seccondary"
          style={{ width: "100%" }}
        >
          ODUSTANI
        </Link>
      </div>
    </form>
  );
}

export default RegleriForm;
