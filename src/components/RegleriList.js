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
}));

const RegleriList = (props) => {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    (async () => {
      var response = await httpget("vrati_zastoje_za_korisnika");
      if (response.data !== null) {
        setLista(response.data);
      }
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
            trajanje_od: new Date(),
            trajanje_do: new Date(),
            opis: "",
            status: 3,
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton edge="start" onClick={handleClickLogout}>
          <ArrowBackIcon />
        </IconButton>
        <h3 style={{ fontFamily: "revert", color: "#fe661d" }}>
          Spisak zastoja
        </h3>
        <IconButton></IconButton>
      </div>
      <Divider />
      <List className={classes.root}>
        {lista.map((item) => {
          return (
            <div key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<b>{item.naziv_masine}</b>}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {item.naziv_alata}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                      >
                        {item.naziv_tipa_zastoja}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        style={{ color: "#fe661d" }}
                      >
                        {item.trajanje_od_prikaz} - {item.trajanje_do_prikaz}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
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
    </div>
  );
};

export default RegleriList;
