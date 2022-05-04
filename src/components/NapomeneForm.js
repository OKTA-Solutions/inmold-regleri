import "date-fns";
import React, { useState, useEffect } from "react";
import { httpost } from "../api/httpHelper";
import { isUndefined } from "lodash";
import { toast } from "react-toastify";
import Smena from "./Smena";
import formatDate from "./formatDate";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export default function NapomeneForm(props) {
  const [napomene, setNapomene] = useState({ datum: new Date() });
  const [opened, setOpened] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const params = props.location.state;
    if (params !== 4 && params !== undefined) {
      setNapomene(params);
      handleProveraId(params);
    }
  }, [props.location.state]);

  function handleChange({ target }) {
    setNapomene({ ...napomene, [target.name]: target.value });
  }

  const handleChangeDatum = (date) => {
    setNapomene({ ...napomene, datum: date });
  };

  function handleSave(e) {
    e.preventDefault();
    if (napomene.id) {
      (async () => {
        var RegleriModel = {
          id: napomene.id,
          vrsta: 4, // mozda promeniti parametarski kad vratim propsom koja je vrsta
          id_masine: 0,
          id_partnera: 0,
          id_alata: 0,
          pripremno_vreme: 0,
          zavrsno_vreme: 0,
          smena: isUndefined(napomene.smena) ? "1" : napomene.smena,
          datum: formatDate(napomene.datum),
          opis: "",
          reseni_problemi: isUndefined(napomene.reseni_problemi)
            ? ""
            : napomene.reseni_problemi,
          nereseni_problemi: isUndefined(napomene.nereseni_problemi)
            ? ""
            : napomene.nereseni_problemi,
          dodatne_aktivnosti: isUndefined(napomene.dodatne_aktivnosti)
            ? ""
            : napomene.dodatne_aktivnosti,
          komentar_predlozi: isUndefined(napomene.komentar_predlozi)
            ? ""
            : napomene.komentar_predlozi,
          status: 2,
          id_pozicije1: 0,
          id_pozicije2: 0,
        };
        debugger;
        var response = await httpost("iud_evidencije_ucinka", RegleriModel);
        if (response.data === true) {
          toast.success("Uspešna izmena.");
          props.history.push("/reglerilist");
        } else {
          alert("Greška pri izmeni.");
          return;
        }
      })();
    } else {
      (async () => {
        var RegleriModel = {
          id: 0,
          vrsta: 4, // mozda promeniti parametarski kad vratim propsom koja je vrsta
          id_masine: 0,
          id_alata: 0,
          pripremno_vreme: 0,
          zavrsno_vreme: 0,
          smena: isUndefined(napomene.smena) ? "1" : napomene.smena,
          datum: formatDate(napomene.datum),
          opis: "",
          reseni_problemi: isUndefined(napomene.reseni_problemi)
            ? ""
            : napomene.reseni_problemi,
          nereseni_problemi: isUndefined(napomene.nereseni_problemi)
            ? ""
            : napomene.nereseni_problemi,
          dodatne_aktivnosti: isUndefined(napomene.dodatne_aktivnosti)
            ? ""
            : napomene.dodatne_aktivnosti,
          komentar_predlozi: isUndefined(napomene.komentar_predlozi)
            ? ""
            : napomene.komentar_predlozi,
          status: 1,
          id_pozicije1: 0,
          id_pozicije2: 0,
        };
        debugger;
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

  function handleKopirajPopUp() {
    setOpened(true);
  }
  function handleProveraId(params) {
    console.log(params);
    if (params.id_korisnika !== +localStorage.id_korisnika) {
      setDisabled(true);
    }
  }
  function handleClose() {
    setOpened(false);
  }
  function handleKopiraj() {
    (async () => {
      let RegleriModel = {
        id_korisnika: +localStorage.id_korisnika,
        id_evidencije: +napomene.id,
      };
      let response = await httpost("evidencija_ucinka_copy", RegleriModel);
      if (response.data !== 0) {
        let obj = {
          ...napomene,
          id: response.data,
        };
        setNapomene(obj);
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
      <label>
        <b>Napomene</b>
      </label>
      <div className="form-group">
        <label>Datum:</label>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            className="form-control"
            margin="normal"
            id="date-picker-dialog"
            format="dd/MM/yyyy"
            value={napomene.datum}
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
          value={napomene.smena}
          disabled={disabled}
        />
         
        <label style={{ marginTop: "5px" }}>
          Rešeni problemi - Uzrok problema:
        </label>
        <div className="field">
          <textarea
            id="reseni_problemi"
            type="text"
            className="form-control"
            name="reseni_problemi"
            rows="3"
            value={napomene.reseni_problemi}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        <label>Nerešeni problemi - Uzrok problema:</label>
        <div className="field">
          <textarea
            id="nereseni_problemi"
            type="text"
            className="form-control"
            name="nereseni_problemi"
            rows="3"
            value={napomene.nereseni_problemi}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        <label>Dodatne aktivnosti:</label>
        <div className="field">
          <textarea
            id="dodatne_aktivnosti"
            type="text"
            className="form-control"
            name="dodatne_aktivnosti"
            rows="3"
            value={napomene.dodatne_aktivnosti}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        <label>Komentar - predlozi:</label>
        <div className="field">
          <textarea
            id="komentar_predlozi"
            type="text"
            className="form-control"
            name="komentar_predlozi"
            rows="3"
            value={napomene.komentar_predlozi}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
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
        {napomene.id !== 0 && (
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
