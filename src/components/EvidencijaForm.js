import "date-fns";
import React, { useState, useEffect } from "react";
import { httpget, httpost } from "../api/httpHelper";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";
import Masine from "./Masine";
import Alati from "./Alati";
import Kupci from "./Kupci";
import Smena from "./Smena";
import Pozicija1 from "./Pozicija1";
import Pozicija2 from "./Pozicija2";
import formatDate from "./formatDate";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export default function EvidencijaForm(props) {
  const [evidencija, setEvidencija] = useState({
    datum: new Date(),
    id: 0,
    id_masine: 0,
    id_alata: 0,
    id_partnera: 0,
    id_pozicije1: 0,
    id_pozicije2: 0,
    id_korisnika: 0,
  });

  console.log(evidencija);
  const [masine, setMasine] = useState([]);
  const [kupci, setKupci] = useState([]);
  const [alati, setAlati] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id_alata, setIdAlata] = useState(0);
  const [id_partnera, setIdPartnera] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [opened, setOpened] = useState(false);

  const [pozicije, setPozicije] = useState([
    {
      id_pozicije1: 0,
      naziv: "",
    },
  ]);
  const [id_pozicije1, setIdPozicije1] = useState(0);
  const [id_pozicije2, setIdPozicije2] = useState(0);

  useEffect(() => {
    setLoading(true);
    (async () => {
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
    const params = props.location.state;
    if (params !== 1 && params !== 2 && params !== 3 && params !== undefined) {
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
      setEvidencija(params);

      setIdPartnera(params.id_partnera);
      setIdAlata(params.id_alata);
      setIdPozicije1(params.id_pozicije1);
      setIdPozicije2(params.id_pozicije2);

      handleProveraId(params);
    }
  }, [props.location.state]);

  function handleChangeKupac({ target }) {
    setEvidencija({ ...evidencija, id_partnera: target.value });
    setIdPartnera(target.value);
    ucitajAlate(target.value);
  }

  const ucitajAlate = (id_partnera) => {
    (async () => {
      var RegleriModel = {
        id_partnera: id_partnera,
      };
      var responseAlati = await httpost("vrati_alate_cmb", RegleriModel);
      if (responseAlati.data !== null) {
        setAlati(responseAlati.data); // upunjavam alate
        setIdAlata(responseAlati.data[0].id_alata);
        ucitajPozicije(
          parseInt(id_partnera),
          parseInt(responseAlati.data[0].id_alata)
        );
      }
    })();
  };

  function handleChange({ target }) {
    setEvidencija({ ...evidencija, [target.name]: target.value });
  }

  const handleChangeDatum = (date) => {
    setEvidencija({ ...evidencija, datum: date });
  };
  //prosirio sa id_korisnika (dodao )
  const handleChangeMasine = ({ target }) => {
    setEvidencija({
      ...evidencija,
      id_masine: target.value,
    });
  };

  const handleChangeAlati = ({ target }) => {
    setEvidencija({ ...evidencija, id_alata: target.value });
    setIdAlata(target.value);
    ucitajPozicije(id_partnera, parseInt(target.value));
  };

  function handleChangePozicije1({ target }) {
    setEvidencija({ ...evidencija, id_pozicije1: target.value });
    setIdPozicije1(target.value);
  }
  function handleChangePozicije2({ target }) {
    setEvidencija({ ...evidencija, id_pozicije2: target.value });
    setIdPozicije2(target.value);
  }

  const ucitajPozicije = (id_partnera, id_alata) => {
    (async () => {
      var RegleriModel = {
        id_partnera: id_partnera,
        id_alata: id_alata,
      };
      var responsePozicije = await httpost("vrati_pozicije", RegleriModel);
      if (responsePozicije.data !== null) {
        setPozicije(responsePozicije.data);
        setIdPozicije1(0);
        setIdPozicije2(0);
      }
    })();
  };

  function handleProveraId(params) {
    if (params.id_korisnika !== +localStorage.id_korisnika) {
      setDisabled(true);
    }
  }

  function handleKopirajPopUp() {
    setOpened(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (evidencija.id) {
      (async () => {
        // if (parseInt(evidencija.pripremno_vreme) > 480) {
        //   alert("Pripremno vreme ne može biti veće od 480 minuta.");
        //   return;
        // }
        // if (parseInt(evidencija.zavrsno_vreme) > 480) {
        //   alert("Završno vreme ne može biti veće od 480 minuta.");
        //   return;
        // }

        var RegleriModel = {
          id: evidencija.id,
          vrsta: props.location.state.vrsta,
          id_masine: isNaN(parseInt(evidencija.id_masine))
            ? 0
            : parseInt(evidencija.id_masine),
          id_partnera: isNaN(parseInt(evidencija.id_partnera))
            ? 0
            : parseInt(evidencija.id_partnera),
          id_alata: id_alata,
          pripremno_vreme: 0,
          zavrsno_vreme: 0,
          smena: isUndefined(evidencija.smena) ? "1" : evidencija.smena,
          datum: formatDate(evidencija.datum),
          opis: isUndefined(evidencija.opis) ? "" : evidencija.opis,
          reseni_problemi: "",
          nereseni_problemi: "",
          dodatne_aktivnosti: "",
          status: 2,
          id_pozicije1: id_pozicije1,
          id_pozicije2: id_pozicije2,
          komentar_predlozi: "",
        };
        var response = await httpost("iud_evidencije_ucinka", RegleriModel);
        if (response.data === true) {
          toast.success("Uspešan unos.");
          props.history.push("/reglerilist");
        } else {
          alert("Greška pri unosu.");
          return;
        }
      })();
    } else {
      (async () => {
        if (evidencija.id_masine === undefined) {
          alert("Odaberite mašinu.");
          return;
        }
        if (evidencija.id_alata === 0 && id_alata === 0) {
          alert("Odaberite alat.");
          return;
        }
        // if (parseInt(evidencija.pripremno_vreme) > 480) {
        //   alert("Pripremno vreme ne može biti veće od 480 minuta.");
        //   return;
        // }
        // if (parseInt(evidencija.zavrsno_vreme) > 480) {
        //   alert("Završno vreme ne može biti veće od 480 minuta.");
        //   return;
        // }
        var RegleriModel = {
          id: 0,
          vrsta: props.location.state,
          id_masine: isNaN(parseInt(evidencija.id_masine))
            ? 0
            : parseInt(evidencija.id_masine),
          id_partnera: isNaN(parseInt(evidencija.id_partnera))
            ? 0
            : parseInt(evidencija.id_partnera),
          id_alata: id_alata,
          pripremno_vreme: 0,
          zavrsno_vreme: 0,
          smena: isUndefined(evidencija.smena) ? "1" : evidencija.smena,
          datum: formatDate(evidencija.datum),
          opis: isUndefined(evidencija.opis) ? "" : evidencija.opis,
          reseni_problemi: "",
          nereseni_problemi: "",
          dodatne_aktivnosti: "",
          status: 1,
          id_pozicije1: id_pozicije1,
          id_pozicije2: id_pozicije2,
          komentar_predlozi: "",
        };
        var response = await httpost("iud_evidencije_ucinka", RegleriModel);
        if (response.data === true) {
          toast.success("Uspešan unos.");
          props.history.push("/reglerilist");
        } else {
          alert("Greška pri unosu.");
          return;
        }
      })();
    }
  }
  function handleClose() {
    setOpened(false);
  }
  function handleKopiraj() {
    (async () => {
      let RegleriModel = {
        id_korisnika: +localStorage.id_korisnika,
        id_evidencije: +evidencija.id,
      };
      let response = await httpost("evidencija_ucinka_copy", RegleriModel);
      if (response.data !== 0) {
        let obj = {
          ...evidencija,
          id: response.data,
        };
        setEvidencija(obj);
        setOpened(false);
        setDisabled(false);
        toast.success("Uspešno kopiran zapis.");
      } else {
        alert("Greška prilikom kopiranja zapisa.");
      }
    })();
  }

  return (
    <form>
      <Backdrop style={{ zIndex: 9999, color: "#fe661d" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <label>
        {props.location.state === 1 || props.location.state.vrsta === 1 ? (
          <b>Podizanje alata</b>
        ) : props.location.state === 2 || props.location.state.vrsta === 2 ? (
          <b>Spuštanje alata</b>
        ) : props.location.state === 3 || props.location.state.vrsta === 3 ? (
          <b>Puštanje mašina u rad</b>
        ) : null}
      </label>
      <div className="form-group">
        <label>Datum:</label>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className="form-control"
            margin="normal"
            id="date-picker-dialog"
            format="dd/MM/yyyy"
            value={evidencija.datum}
            onChange={handleChangeDatum}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            style={{ marginTop: "-6px" }}
            disabled={disabled}
          />
        </MuiPickersUtilsProvider>
        <label>Smena:</label>
        <Smena
          onChange={handleChange}
          value={evidencija.smena}
          disabled={disabled}
        />
         <label>Mašina:</label>
        <Masine
          masine={masine}
          masina={evidencija.id_masine}
          onChange={handleChangeMasine}
          disabled={disabled}
        />
        <label>Kupac:</label>
        <Kupci
          kupci={kupci}
          kupac={evidencija.id_partnera}
          onChange={handleChangeKupac}
          disabled={disabled}
        />
        <label>Alat:</label>
        <Alati
          alati={alati}
          alat={evidencija.id_alata}
          onChange={handleChangeAlati}
          disabled={disabled}
        />
        {props.location.state === 3 || props.location.state.vrsta === 3 ? (
          <>
            <label>Pozicija 1:</label>
            <Pozicija1
              pozicije={pozicije}
              pozicija={evidencija.id_pozicije1}
              onChange={handleChangePozicije1}
              disabled={disabled}
            />
            <label>Pozicija 2:</label>
            <Pozicija2
              pozicije={pozicije}
              pozicija={evidencija.id_pozicije2}
              onChange={handleChangePozicije2}
              disabled={disabled}
            />
          </>
        ) : null}
        {/* {props.location.state === 1 || props.location.state.vrsta === 1 ? (
          <>
             <label>Pripremno vreme:</label>
            <input
              id="pripremno_vreme"
              type="number"
              className="form-control"
              name="pripremno_vreme"
              value={evidencija.pripremno_vreme}
              placeholder="u minutima"
              onChange={handleChange}
            />
          </>
        ) : props.location.state === 2 || props.location.state.vrsta === 2 ? (
          <>
             <label>Završno vreme:</label>
            <input
              id="zavrsno_vreme"
              type="number"
              className="form-control"
              name="zavrsno_vreme"
              value={evidencija.zavrsno_vreme}
              placeholder="u minutima"
              onChange={handleChange}
            />
          </>
        ) : props.location.state === 3 || props.location.state.vrsta === 3 ? (
          <>
             <label>Pripremno vreme:</label>
            <input
              id="pripremno_vreme"
              type="number"
              className="form-control"
              name="pripremno_vreme"
              value={evidencija.pripremno_vreme}
              placeholder="u minutima"
              onChange={handleChange}
            />
          </>
        ) : null} */}
        <label>Komentar:</label>
        <div className="field">
          <textarea
            id="opis"
            type="text"
            className="form-control"
            name="opis"
            value={evidencija.opis}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
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
            disabled={disabled}
          >
            SAČUVAJ
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
          {evidencija.id !== 0 && (
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
                marginTop: "30px",
              }}
              size="small"
              onClick={handleKopirajPopUp}
            >
              KOPIRAJ
            </Fab>
          )}
        </div>
      </div>
      <Dialog
        open={opened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Upozorenje!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Da li ste sigurni da želite da kopirate izabrani zapis?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Odustani
          </Button>
          <Button color="primary" autoFocus onClick={handleKopiraj}>
            Potvrdi
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
