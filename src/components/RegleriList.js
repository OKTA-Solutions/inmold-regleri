import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { httpget, httpost } from "../api/httpHelper";
import cookie from "react-cookies";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    background: "#fe661d",
    color: "#fff",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const RegleriList = (props) => {
  const [lista, setLista] = useState([]);
  const [evidencija, setEvidencija] = useState([]);
  const [popup, setPopup] = useState(false);
  const [popupPodaci, setPodaci] = useState({});
  const [popupEvidencija, setPopupEvidencija] = useState(false);
  const [popupEvPodaci, setPodaciEvidencija] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      var response = await httpget("vrati_zastoje_za_korisnika");
      if (response.data !== null) {
        setLista(response.data);
      }
    })();
    (async () => {
      var responseEvidencija = await httpget("vrati_evidenciju_za_korisnika");
      if (responseEvidencija.data !== null) {
        setEvidencija(responseEvidencija.data);
      }
      setLoading(false);
    })();
  }, []);

  const classes = useStyles();

  function handleClickLogout(e) {
    e.preventDefault();
    cookie.remove("jwtToken");
    props.history.push("/");
  }

  function handleFabClick(e) {
    e.preventDefault();
    props.history.push("/regleriform");
  }

  function handeIzmeni(e, items) {
    e.preventDefault();
    props.history.push({
      pathname: "/regleriform",
      state: items,
    });
  }

  const handleListClick = (items) => {
    setPodaci(items);
    setPopup(true);
  };
  const handleClose = () => {
    setPopup(false);
    setPopupEvidencija(false);
  };
  const handleEvidencijaClick = (items) => {
    setPodaciEvidencija(items);
    setPopupEvidencija(true);
  };

  function handleDelete(e, id) {
    e.preventDefault();
    swal({
      text: "Da li ste sigurni da želite da obrišete izabranu stavku?",
      icon: "warning",
      closeOnEsc: true,
      buttons: true,
      dangerMode: true,
    }).then((Ok) => {
      if (Ok) {
        (async () => {
          var RegleriModel = {
            id: id,
            id_masine: 0,
            id_alata: 0,
            id_zastoja: 0,
            smena: "",
            trajanje: 0,
            opis: "",
            status: 3,
            id_partnera: 0,
            id_pozicije1: 0,
            id_pozicije2: 0,
            prociscavanje_agregata: "",
            ciscenje_dizne: "",
            pogace: "",
          };
          var response = await httpost("iud_reglera", RegleriModel);
          if (response.data === true) {
            var responseLista = await httpget("vrati_zastoje_za_korisnika");
            if (responseLista.data !== null) {
              setLista(responseLista.data);
              toast.success("Zastoj uspešno obrisan.");
            } else {
              alert("Greška prilikom vraćanja liste.");
              return;
            }
          } else {
            alert("Greška prilikom brisanja stavke.");
            return;
          }
        })();
      }
    });
  }

  function handleDeleteEvidencija(e, id) {
    e.preventDefault();
    swal({
      text: "Da li ste sigurni da želite da obrišete izabranu stavku?",
      icon: "warning",
      closeOnEsc: true,
      buttons: true,
      dangerMode: true,
    }).then((Ok) => {
      if (Ok) {
        (async () => {
          var RegleriModel = {
            id: id,
            vrsta: 0,
            id_masine: 0,
            id_alata: 0,
            pripremno_vreme: 0,
            zavrsno_vreme: 0,
            smena: "",
            opis: "",
            reseni_problemi: "",
            nereseni_problemi: "",
            dodatne_aktivnosti: "",
            id_pozicije1: 0,
            id_pozicije2: 0,
            komentar_predlozi: "",
            status: 3,
          };
          var response = await httpost("iud_evidencije_ucinka", RegleriModel);
          if (response.data === true) {
            var responseEvidencija = await httpget(
              "vrati_evidenciju_za_korisnika"
            );
            if (responseEvidencija.data !== null) {
              setEvidencija(responseEvidencija.data);
              toast.success("Uspešno brisanje.");
            }
          } else {
            alert("Greška prilikom brisanja.");
            return;
          }
        })();
      }
    });
  }

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickEvidencija = (e, items) => {
    e.preventDefault();
    props.history.push({
      pathname: "/evidencijaform",
      state: items,
    });
  };

  const handleClickNapomene = (e, items) => {
    e.preventDefault();
    props.history.push({
      pathname: "/napomeneform",
      state: items,
    });
  };

  function handeIzmeniNapomene(e, items) {
    e.preventDefault();
    props.history.push({
      pathname: "/napomeneform",
      state: items,
    });
  }

  function handeIzmeniEvidenciju(e, items) {
    e.preventDefault();
    props.history.push({
      pathname: "/evidencijaform",
      state: items,
    });
  }

  return (
    <div>
      <Backdrop style={{ zIndex: 9999, color: "#fe661d" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton edge="start" onClick={handleClickLogout}>
          <ArrowBackIcon />
        </IconButton>
        <h3
          style={{ fontFamily: "revert", color: "#fe661d", letterSpacing: 3 }}
        >
          Regleri
        </h3>
        <IconButton></IconButton>
      </div>
      <Divider />

      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        style={{ color: "black" }}
      >
        <Tab label="Zastoji" {...a11yProps(0)} style={{ width: "50%" }} />
        <Tab
          label="Evidencija učinka"
          {...a11yProps(1)}
          style={{ width: "50%" }}
        />
      </Tabs>
      <TabPanel value={tabValue} index={0} style={{ padding: "0px" }}>
        <List className={classes.root}>
          {lista.map((item) => {
            return (
              <div key={item.id}>
                <ListItem
                  alignItems="flex-start"
                  style={{
                    background: item.priprema === true ? "#ffa07a91" : null,
                  }}
                >
                  <ListItemText
                    onClick={(e) => handleListClick(item)}
                    primary={
                      <b>
                        {item.sifra_masine} / {item.datum_prikaz}
                      </b>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {item.smena === "1"
                            ? "Prva smena"
                            : item.smena === "2"
                            ? "Druga smena"
                            : item.smena === "3"
                            ? "Treća smena"
                            : null}
                        </Typography>
                        <br />
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => handeIzmeni(e, item)}
                      style={{ marginRight: "5px" }}
                    >
                      <EditIcon style={{ color: "#fe661d" }} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDelete(e, item.id)}
                    >
                      <DeleteIcon style={{ color: "#e4020f" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
        <Fab className={classes.fab} onClick={handleFabClick}>
          <AddIcon />
        </Fab>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Accordion style={{ marginTop: "2px" }}>
          <AccordionSummary style={{ backgroundColor: "#ffa07a91" }}>
            <Typography className={classes.heading}>Podignuti alati</Typography>
            <IconButton
              style={{ marginLeft: "auto", color: "#fe661d" }}
              size="small"
              onClick={(e) => handleClickEvidencija(e, 1)}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "block", padding: "0px", listStyle: "none" }}
          >
            <List className={classes.root}>
              {evidencija.map((item) => {
                return (
                  <div key={item.id}>
                    {item.vrsta === 1 ? (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            onClick={(e) => handleEvidencijaClick(item)}
                            primary={
                              <b>
                                {item.sifra_masine} / {item.naziv_alata}
                              </b>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className={classes.inline}
                                  color="textPrimary"
                                >
                                  {item.smena === "1"
                                    ? "Prva smena"
                                    : item.smena === "2"
                                    ? "Druga smena"
                                    : item.smena === "3"
                                    ? "Treća smena"
                                    : null}{" "}
                                  / {item.datum_prikaz}
                                </Typography>
                                <br />
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={(e) => handeIzmeniEvidenciju(e, item)}
                              style={{ marginRight: "5px" }}
                            >
                              <EditIcon style={{ color: "#fe661d" }} />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) =>
                                handleDeleteEvidencija(e, item.id)
                              }
                            >
                              <DeleteIcon style={{ color: "#e4020f" }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary style={{ backgroundColor: "#ffa07a91" }}>
            <Typography className={classes.heading}>Spušteni alati</Typography>
            <IconButton
              style={{ marginLeft: "auto", color: "#fe661d" }}
              size="small"
              onClick={(e) => handleClickEvidencija(e, 2)}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "block", padding: "0px", listStyle: "none" }}
          >
            <List className={classes.root}>
              {evidencija.map((item) => {
                return (
                  <div key={item.id}>
                    {item.vrsta === 2 ? (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            onClick={(e) => handleEvidencijaClick(item)}
                            primary={
                              <b>
                                {item.sifra_masine} / {item.naziv_alata}
                              </b>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className={classes.inline}
                                  color="textPrimary"
                                >
                                  {item.smena === "1"
                                    ? "Prva smena"
                                    : item.smena === "2"
                                    ? "Druga smena"
                                    : item.smena === "3"
                                    ? "Treća smena"
                                    : null}{" "}
                                  / {item.datum_prikaz}
                                </Typography>
                                <br />
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={(e) => handeIzmeniEvidenciju(e, item)}
                              style={{ marginRight: "5px" }}
                            >
                              <EditIcon style={{ color: "#fe661d" }} />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) =>
                                handleDeleteEvidencija(e, item.id)
                              }
                            >
                              <DeleteIcon style={{ color: "#e4020f" }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary style={{ backgroundColor: "#ffa07a91" }}>
            <Typography className={classes.heading}>
              Puštanje mašina u rad
            </Typography>
            <IconButton
              style={{ marginLeft: "auto", color: "#fe661d" }}
              size="small"
              onClick={(e) => handleClickEvidencija(e, 3)}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "block", padding: "0px", listStyle: "none" }}
          >
            <List className={classes.root}>
              {evidencija.map((item) => {
                return (
                  <div key={item.id}>
                    {item.vrsta === 3 ? (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            onClick={(e) => handleEvidencijaClick(item)}
                            primary={
                              <b>
                                {item.sifra_masine} / {item.naziv_alata}
                              </b>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className={classes.inline}
                                  color="textPrimary"
                                >
                                  {item.smena === "1"
                                    ? "Prva smena"
                                    : item.smena === "2"
                                    ? "Druga smena"
                                    : item.smena === "3"
                                    ? "Treća smena"
                                    : null}{" "}
                                  / {item.datum_prikaz}
                                </Typography>
                                <br />
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={(e) => handeIzmeniEvidenciju(e, item)}
                              style={{ marginRight: "5px" }}
                            >
                              <EditIcon style={{ color: "#fe661d" }} />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) =>
                                handleDeleteEvidencija(e, item.id)
                              }
                            >
                              <DeleteIcon style={{ color: "#e4020f" }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary style={{ backgroundColor: "#ffa07a91" }}>
            <Typography className={classes.heading}>Napomene</Typography>
            <IconButton
              style={{ marginLeft: "auto", color: "#fe661d" }}
              size="small"
              onClick={(e) => handleClickNapomene(e, 4)}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails
            style={{ display: "block", padding: "0px", listStyle: "none" }}
          >
            <List className={classes.root}>
              {evidencija.map((item) => {
                return (
                  <div key={item.id}>
                    {item.vrsta === 4 ? (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            onClick={(e) => handleEvidencijaClick(item)}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className={classes.inline}
                                  color="textPrimary"
                                >
                                  <b>RP:</b>{" "}
                                  {item.reseni_problemi.substring(0, 29)}
                                  {/* skracujem prikaz u listi */}
                                  {item.reseni_problemi.length > 29
                                    ? "..."
                                    : null}{" "}
                                  {/* prikazujem ... pod uslovom da lista ima vise karaktera od skracenih */}
                                  <br />
                                  <b>NP:</b>{" "}
                                  {item.nereseni_problemi.substring(0, 29)}
                                  {item.nereseni_problemi.length > 29
                                    ? "..."
                                    : null}
                                  <br />
                                  <b>DA:</b>{" "}
                                  {item.dodatne_aktivnosti.substring(0, 29)}
                                  {item.dodatne_aktivnosti.length > 29
                                    ? "..."
                                    : null}
                                  <br />
                                  <b>KP:</b>{" "}
                                  {item.komentar_predlozi.substring(0, 29)}
                                  {item.komentar_predlozi.length > 29
                                    ? "..."
                                    : null}
                                </Typography>
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={(e) => handeIzmeniNapomene(e, item)}
                              style={{ marginRight: "5px" }}
                            >
                              <EditIcon style={{ color: "#fe661d" }} />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) =>
                                handleDeleteEvidencija(e, item.id)
                              }
                            >
                              <DeleteIcon style={{ color: "#e4020f" }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </TabPanel>

      {/* Popup dialog za zastoje */}
      <Dialog
        open={popup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Zastoj"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              <b>Datum: </b> {popupPodaci.datum_prikaz}
            </p>
            <p>
              <b>Smena: </b>{" "}
              {popupPodaci.smena === "1"
                ? "Prva smena"
                : popupPodaci.smena === "2"
                ? "Druga smena"
                : popupPodaci.smena === "3"
                ? "Treća smena"
                : null}
            </p>
            <p>
              <b>Mašina: </b> {popupPodaci.masina_izmena}
            </p>
            <p>
              <b>Kupac: </b> {popupPodaci.kupac}
            </p>
            <p>
              <b>Alat: </b> {popupPodaci.alat_izmena}
            </p>
            <p>
              <b>Pozicija 1: </b> {popupPodaci.poz1_izmena}
            </p>
            <p>
              <b>Pozicija 2: </b> {popupPodaci.poz2_izmena}
            </p>
            <p>
              <b>Zastoj: </b> {popupPodaci.zastoj_izmena}
            </p>
            <p>
              <b>Trajanje: </b> {popupPodaci.trajanje} minuta
            </p>
            <p>
              <b>Pročišćavanje agregata: </b>{" "}
              {popupPodaci.prociscavanje_agregata}
            </p>
            <p>
              <b>Čišćenje dizne: </b> {popupPodaci.ciscenje_dizne}
            </p>
            <p>
              <b>Pogače: </b> {popupPodaci.pogace}
            </p>
            <p>
              <b>Komentar: </b> {popupPodaci.opis}
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* Popup dialog za evidenciju */}
      <Dialog
        open={popupEvidencija}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {popupEvPodaci.vrsta === 1
            ? "Podignuti alati"
            : popupEvPodaci.vrsta === 2
            ? "Spušteni alati"
            : popupEvPodaci.vrsta === 3
            ? "Puštanje mašina u rad"
            : popupEvPodaci.vrsta === 4
            ? "Napomene"
            : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              <b>Datum: </b> {popupEvPodaci.datum_prikaz}
            </p>
            <p>
              <b>Smena: </b>{" "}
              {popupEvPodaci.smena === "1"
                ? "Prva smena"
                : popupEvPodaci.smena === "2"
                ? "Druga smena"
                : popupEvPodaci.smena === "3"
                ? "Treća smena"
                : null}
            </p>
            {popupEvPodaci.vrsta !== 4 ? (
              <>
                <p>
                  <b>Mašina: </b> {popupEvPodaci.sifra_masine} -{" "}
                  {popupEvPodaci.naziv_masine}
                </p>
                <p>
                  <b>Alat: </b> {popupEvPodaci.alat} -{" "}
                  {popupEvPodaci.naziv_alata}
                </p>
              </>
            ) : null}
            {popupEvPodaci.vrsta === 3 ? (
              <>
                <p>
                  <b>Pozicija 1: </b> {popupEvPodaci.poz1_izmena}
                </p>
                <p>
                  <b>Pozicija 2: </b> {popupEvPodaci.poz2_izmena}
                </p>
              </>
            ) : null}
            {popupEvPodaci.vrsta === 1 ? (
              <p>
                <b>Pripremno vreme: </b> {popupEvPodaci.pripremno_vreme} minuta
              </p>
            ) : popupEvPodaci.vrsta === 2 ? (
              <p>
                <b>Završno vreme: </b> {popupEvPodaci.zavrsno_vreme} minuta
              </p>
            ) : popupEvPodaci.vrsta === 3 ? (
              <p>
                <b>Pripremno vreme: </b> {popupEvPodaci.pripremno_vreme} minuta
              </p>
            ) : null}
            {popupEvPodaci.vrsta === 4 ? (
              <>
                <p>
                  <b>Rešeni problemi: </b> {popupEvPodaci.reseni_problemi}
                </p>
                <p>
                  <b>Nerešeni problemi: </b> {popupEvPodaci.nereseni_problemi}
                </p>
                <p>
                  <b>Dodatne aktivnosti: </b> {popupEvPodaci.dodatne_aktivnosti}
                </p>
                <p>
                  <b>Komentar: </b> {popupEvPodaci.komentar_predlozi}
                </p>
              </>
            ) : null}

            {popupEvPodaci.vrsta !== 4 ? (
              <p>
                <b>Komentar: </b> {popupEvPodaci.opis}
              </p>
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegleriList;
