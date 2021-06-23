import axios from "axios";
import cookie from "react-cookies";

var api = "https://localhost:44386/api/";
//var api = "http://173.212.203.236/Inmold_Demo-API/api/";

export async function httpget(controller) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${cookie.load(
    "jwtToken"
  )}`;
  return await axios.get(api + controller).then(function (response) {
    return response;
  });
}
export async function httpost(controller, model) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${cookie.load(
    "jwtToken"
  )}`;
  return await axios.post(api + controller, model).then(function (response) {
    return response;
  });
}
export async function login_auth(model) {
  localStorage.clear();
  return await axios.post(api + "login", model).then(function (response) {
    localStorage.setItem("fullname", response.data.fullname);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem(
      "raspodela_troskova",
      response.data.raspodela_troskova
    );
    localStorage.setItem("sa_racun", response.data.sa_racun);
    localStorage.setItem("likvidator", response.data.likvidator);
    localStorage.setItem(
      "odeljenje_odobrenje",
      response.data.odeljenje_odobrenje
    );
    localStorage.setItem("odobrava_nabavku", response.data.odobrava_nabavku);
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("id_firme", response.data.id_firme);
    cookie.save("jwtToken", response.data.token, { path: "/" });
    return response;
  });
}
