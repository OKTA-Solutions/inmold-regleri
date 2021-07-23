import "date-fns";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Zastoji from "./Zastoji";
import Smena from "./Smena";
import Masine from "./Masine";
import Alati from "./Alati";
import Kupci from "./Kupci";
import { httpget, httpost } from "../api/httpHelper";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";
import Pozicija1 from "./Pozicija1";
import Pozicija2 from "./Pozicija2";
import Fab from "@material-ui/core/Fab";
import formatDate from "./formatDate";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

function RegleriForm(props) {
  const [zastoji, setZastoji] = useState({
    datum: new Date(),
    id_masine: 0,
    id_alata: 0,
    id_partnera: 0,
    id_pozicije1: 0,
    id_pozicije2: 0,
  });
  const [zastoj, setZastoj] = useState([]);
  const [masine, setMasine] = useState([]);
  const [alati, setAlati] = useState([]);
  const [kupci, setKupci] = useState([]);
  const [pozicije, setPozicije] = useState([]);
  const [id_partnera, setIdPartnera] = useState(0);
  const [agregat, setAgregat] = useState("ne");
  const [dizna, setDizna] = useState("ne");
  const [loading, setLoading] = useState(false);
  const [id_alata, setIdAlata] = useState(0);
  const [id_pozicije1, setIdPozicije1] = useState(0);
  const [id_pozicije2, setIdPozicije2] = useState(0);
  const [id_zastoja, setIdZastoja] = useState(0);

  useEffect(() => {
    setLoading(true);
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
      setLoading(false);
    })();

    const params = props.location.state; // ako ima vrednost znaci da je izmena
    if (params) {
      // pri izmeni upunjavam prvo kombobokseve koji su po defaultu prazni, jer se inace upunjavaju na odabri iz drugog komba
      (async () => {
        var RegleriModel = {
          id_partnera: parseInt(params.id_partnera),
        };
        var responseAlati = await httpost("vrati_alate_cmb", RegleriModel);
        if (responseAlati.data !== null) {
          setAlati(responseAlati.data);
        }
        RegleriModel = {
          id_partnera: parseInt(params.id_partnera),
          id_alata: parseInt(params.id_alata),
        };
        var responsePozicije = await httpost("vrati_pozicije", RegleriModel);
        if (responsePozicije.data !== null) {
          setPozicije(responsePozicije.data);
        }
      })();

      setZastoji(params);
      setIdPartnera(params.id_partnera);
      setIdAlata(params.id_alata);
      setIdPozicije1(params.id_pozicije1);
      setIdPozicije2(params.id_pozicije2);
      setIdZastoja(params.id_zastoja);
    }
  }, [props.location.state]);

  function handleChange({ target }) {
    debugger;
    setZastoji({ ...zastoji, [target.name]: target.value });
  }

  const handleChangeDatum = (date) => {
    setZastoji({ ...zastoji, datum: date });
  };

  function handleChangeAgregat({ target }) {
    setAgregat({ [target.name]: target.value });
  }
  function handleChangeDizna({ target }) {
    setDizna({ [target.name]: target.value });
  }
  // ovde se na promenu kupca ucitavaju alati, ali i pozicije u slucaju da ima samo jedan alat i jedna pozicija tako ce da pokupi vrednost prve, inace je null
  // isto se radi i u sledecoj funkciji handleChangeAlat za promenu alata vraca poziciju i setuje prvu kao vrednost
  function handleChangeKupac({ target }) {
    setZastoji({ ...zastoji, id_partnera: target.value });
    setIdPartnera(target.value);
    ucitajAlate(target.value);
  }

  const ucitajAlate = (id_partnera) => {
    (async () => {
      var RegleriModel = {
        id_partnera: parseInt(id_partnera),
      };
      var responseAlati = await httpost("vrati_alate_cmb", RegleriModel);
      if (responseAlati.data !== null) {
        setAlati(responseAlati.data); // upunjavam alate
        //setIdPartnera(parseInt(id_partnera)); // setujem id partnera jer ga treba poslati na promenu alata
        setIdAlata(responseAlati.data[0].id_alata);
        ucitajPozicije(
          parseInt(id_partnera),
          parseInt(responseAlati.data[0].id_alata)
        );
      }
    })();
    //setZastoji({ ...zastoji, [target.name]: target.value }); // ovde se sve ove vrednosti upisu u state
  };

  const ucitajPozicije = (id_partnera, id_alata) => {
    (async () => {
      var RegleriModel = {
        id_partnera: id_partnera,
        id_alata: id_alata,
      };
      var responsePozicije = await httpost("vrati_pozicije", RegleriModel);
      if (responsePozicije.data !== null) {
        setPozicije(responsePozicije.data);
        setIdPozicije1(responsePozicije.data[0].id_artikla);
        setIdPozicije2(responsePozicije.data[0].id_artikla);
      }
    })();
  };

  function handleChangeAlat({ target }) {
    setZastoji({ ...zastoji, id_alata: target.value });
    setIdAlata(target.value);
    ucitajPozicije(id_partnera, parseInt(target.value));
  }

  function handleChangePozicije1({ target }) {
    setZastoji({ ...zastoji, id_pozicije1: target.value });
    setIdPozicije1(target.value);
  }
  function handleChangePozicije2({ target }) {
    setZastoji({ ...zastoji, id_pozicije2: target.value });
    setIdPozicije2(target.value);
  }

  function handleSave(e) {
    e.preventDefault();
    if (zastoji.id) {
      debugger;
      (async () => {
        if (parseInt(zastoji.trajanje) > 480) {
          alert("Trajanje ne može biti veće od 480 minuta."); // proveriti kako ove alertove prikazuje na telefonu
          return;
        }
        var RegleriModel = {
          id: zastoji.id,
          id_masine: isNaN(parseInt(zastoji.id_masine))
            ? 0
            : parseInt(zastoji.id_masine),
          id_alata: id_alata,
          id_zastoja: id_zastoja,
          smena: isUndefined(zastoji.smena) ? "1" : zastoji.smena,
          opis: isUndefined(zastoji.opis) ? "" : zastoji.opis,
          id_partnera: id_partnera,
          trajanje: isNaN(parseInt(zastoji.trajanje)) ? 0 : zastoji.trajanje,
          id_pozicije1: id_pozicije1,
          id_pozicije2: id_pozicije2,
          prociscavanje_agregata: isUndefined(agregat.agregat)
            ? zastoji.prociscavanje_agregata
            : agregat.agregat,
          ciscenje_dizne: isUndefined(dizna.dizna)
            ? zastoji.ciscenje_dizne
            : dizna.dizna,
          pogace: isUndefined(zastoji.pogace) ? "" : zastoji.pogace,
          status: 2,
          datum: formatDate(zastoji.datum),
          priprema: false,
        };
        debugger;
        var response = await httpost("iud_reglera", RegleriModel);
        if (response.data === true) {
          toast.success("Zastoj uspešno unet.");
          props.history.push("/reglerilist");
        } else {
          alert("Greška pri unosu zastoja.");
          return;
        }
      })();
    } else {
      (async () => {
        if (parseInt(zastoji.trajanje) > 480) {
          alert("Trajanje ne može biti veće od 480 minuta."); // proveriti kako ove alertove prikazuje na telefonu
          return;
        }
        if (zastoji.id_masine === undefined) {
          alert("Odaberite mašinu.");
          return;
        }
        if (zastoji.id_partnera === undefined) {
          alert("Odaberite kupca.");
          return;
        }
        if (zastoji.id_alata === 0 && id_alata === 0) {
          alert("Odaberite alat.");
          return;
        }
        if (zastoji.id_zastoja === undefined) {
          alert("Odaberite zastoj.");
          return;
        }

        var RegleriModel = {
          id: 0,
          id_masine: isNaN(parseInt(zastoji.id_masine))
            ? 0
            : parseInt(zastoji.id_masine),
          id_alata: id_alata,
          id_zastoja: id_zastoja,
          smena: isUndefined(zastoji.smena) ? "1" : zastoji.smena,
          opis: isUndefined(zastoji.opis) ? "" : zastoji.opis,
          status: 1,
          id_partnera: id_partnera,
          trajanje: isNaN(parseInt(zastoji.trajanje)) ? 0 : zastoji.trajanje,
          id_pozicije1: id_pozicije1,
          id_pozicije2: id_pozicije2,
          prociscavanje_agregata: isUndefined(agregat.agregat)
            ? "ne"
            : agregat.agregat,
          ciscenje_dizne: isUndefined(dizna.dizna) ? "ne" : dizna.dizna,
          pogace: isUndefined(zastoji.pogace) ? "" : zastoji.pogace,
          datum: formatDate(zastoji.datum),
          priprema: false,
        };
        debugger;
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
  }

  function handlePripremi(e) {
    e.preventDefault();
    if (zastoji.id) {
      (async () => {
        if (zastoji.trajanje > "480") {
          alert("Trajanje ne može biti veće od 480 minuta."); // proveriti kako ove alertove prikazuje na telefonu
          return;
        }
        var RegleriModel = {
          id: zastoji.id,
          id_masine: isNaN(parseInt(zastoji.id_masine))
            ? 0
            : parseInt(zastoji.id_masine),
          id_alata: id_alata,
          id_zastoja: id_zastoja,
          smena: isUndefined(zastoji.smena) ? "1" : zastoji.smena,
          opis: isUndefined(zastoji.opis) ? "" : zastoji.opis,
          id_partnera: id_partnera,
          trajanje: isNaN(parseInt(zastoji.trajanje)) ? 0 : zastoji.trajanje,
          id_pozicije1: id_pozicije1,
          id_pozicije2: id_pozicije2,
          prociscavanje_agregata: isUndefined(agregat.agregat)
            ? zastoji.prociscavanje_agregata
            : agregat.agregat,
          ciscenje_dizne: isUndefined(dizna.dizna)
            ? zastoji.ciscenje_dizne
            : dizna.dizna,
          pogace: isUndefined(zastoji.pogace) ? "" : zastoji.pogace,
          status: 2,
          datum: formatDate(zastoji.datum),
          priprema: true,
        };
        debugger;
        var response = await httpost("iud_reglera", RegleriModel);
        if (response.data === true) {
          toast.success("Zastoj uspešno unet.");
          props.history.push("/reglerilist");
        } else {
          alert("Greška pri unosu zastoja.");
          return;
        }
      })();
    } else {
      (async () => {
        if (zastoji.trajanje > "480") {
          alert("Trajanje ne može biti veće od 480 minuta."); // proveriti kako ove alertove prikazuje na telefonu
          return;
        }
        if (zastoji.id_masine === undefined) {
          alert("Odaberite mašinu.");
          return;
        }
        if (zastoji.id_partnera === undefined) {
          alert("Odaberite kupca.");
          return;
        }
        if (zastoji.id_alata === undefined) {
          alert("Odaberite alat.");
          return;
        }
        if (zastoji.id_zastoja === undefined) {
          alert("Odaberite zastoj.");
          return;
        }

        var RegleriModel = {
          id: 0,
          id_masine: isNaN(parseInt(zastoji.id_masine))
            ? 0
            : parseInt(zastoji.id_masine),
          id_alata: id_alata,
          id_zastoja: id_zastoja,
          smena: isUndefined(zastoji.smena) ? "1" : zastoji.smena,
          opis: isUndefined(zastoji.opis) ? "" : zastoji.opis,
          status: 1,
          id_partnera: id_partnera,
          trajanje: isNaN(parseInt(zastoji.trajanje)) ? 0 : zastoji.trajanje,
          id_pozicije1: id_pozicije1,
          id_pozicije2: id_pozicije2,
          prociscavanje_agregata: isUndefined(agregat.agregat)
            ? "ne"
            : agregat.agregat,
          ciscenje_dizne: isUndefined(dizna.dizna) ? "ne" : dizna.dizna,
          pogace: isUndefined(zastoji.pogace) ? "" : zastoji.pogace,
          datum: formatDate(zastoji.datum),
          priprema: true,
        };
        debugger;
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
  }

  const handleChangeMasine = ({ target }) => {
    setZastoji({ ...zastoji, id_masine: target.value });
  };

  const handleChangeZastoj = ({ target }) => {
    setZastoji({ ...zastoji, id_zastoja: target.value });
    setIdZastoja(target.value);
  };

  return (
    <form>
      <Backdrop style={{ zIndex: 9999, color: "#fe661d" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="form-group">
        <label>Mašina:</label>
        <Masine
          masine={masine}
          masina={zastoji.id_masine} // ovde sam stao, proveriti ako posaljem ovako vrednost ne radi promena na izmeni
          onChange={handleChangeMasine}
        />
        <label>Kupac:</label>
        <Kupci
          kupci={kupci}
          kupac={zastoji.id_partnera}
          onChange={handleChangeKupac}
        />
        <label>Alat:</label>
        <Alati
          alati={alati}
          alat={zastoji.id_alata}
          onChange={handleChangeAlat}
        />
        <label>Pozicija 1:</label>
        <Pozicija1
          pozicije={pozicije}
          pozicija={zastoji.id_pozicije1}
          onChange={handleChangePozicije1}
        />
        <label>Pozicija 2:</label>
        <Pozicija2
          pozicije={pozicije}
          pozicija={zastoji.id_pozicije2}
          onChange={handleChangePozicije2}
        />
        <label>Zastoj:</label>
        <Zastoji
          zastoji={zastoj}
          zastoj={zastoji.id_zastoja}
          onChange={handleChangeZastoj}
        />
        <label>Smena:</label>
        <Smena onChange={handleChange} value={zastoji.smena} />
        <label style={{ marginTop: "5px" }}>Pročišćavanje agregata:</label>
        &nbsp;&nbsp;&nbsp;
        <input
          type="radio"
          id="agregat"
          name="agregat"
          value={"da"}
          onChange={handleChangeAgregat}
        />
          <label htmlFor="agregat">DA</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="radio"
          id="agregat"
          name="agregat"
          value={"ne"}
          onChange={handleChangeAgregat}
        />
          <label htmlFor="agregat">NE</label>
        <label style={{ marginTop: "5px" }}>Čišćenje dizne:</label>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="radio"
          id="dizna"
          name="dizna"
          value="da"
          onChange={handleChangeDizna}
        />
          <label htmlFor="dizna">DA</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="radio"
          id="dizna"
          name="dizna"
          value="ne"
          onChange={handleChangeDizna}
        />
          <label htmlFor="dizna">NE</label>
        <br /> <label>Pogače:</label>
        <input
          id="pogace"
          type="number"
          className="form-control"
          name="pogace"
          placeholder="u kilogramima"
          value={zastoji.pogace}
          onChange={handleChange}
        />
         <label>Datum:</label>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className="form-control"
            margin="normal"
            id="date-picker-dialog"
            format="dd/MM/yyyy"
            value={zastoji.datum}
            onChange={handleChangeDatum}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            style={{ marginTop: "-6px" }}
          />
        </MuiPickersUtilsProvider>
         <label>Trajanje:</label>
        <input
          id="trajanje"
          type="number"
          className="form-control"
          name="trajanje"
          value={zastoji.trajanje}
          placeholder="u minutima"
          onChange={handleChange}
        />
        <label>Komentar:</label>
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
        <div>
          <Fab
            variant="extended"
            type="submit"
            style={{
              width: "100%",
              background: "#fe661d",
              color: "#fff",
              fontSize: "inherit",
              fontWeight: 500,
              letterSpacing: "3px",
              marginBottom: "5px",
            }}
            size="small"
            onClick={handleSave}
          >
            SAČUVAJ
          </Fab>
          <Fab
            variant="extended"
            style={{
              width: "100%",
              background: "lightsalmon",
              color: "#fff",
              fontSize: "inherit",
              fontWeight: 500,
              letterSpacing: "3px",
              marginBottom: "5px",
            }}
            size="small"
            onClick={handlePripremi}
          >
            PRIPREMI
          </Fab>
          <Fab
            variant="extended"
            style={{
              width: "100%",
              fontSize: "inherit",
              fontWeight: 500,
              letterSpacing: "3px",
            }}
            size="small"
          >
            <Link to="reglerilist">ODUSTANI</Link>
          </Fab>
        </div>
      </div>
    </form>
  );
}

export default RegleriForm;
