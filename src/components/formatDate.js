export default function formatDateTime(todayISO) {
  var DateISO = new Date(todayISO);
  var dd = DateISO.getDate(); // 10
  var mm = DateISO.getMonth() + 1;
  var yyyy = DateISO.getFullYear();
  var hh = DateISO.getHours();
  var MM = DateISO.getMinutes();
  var ss = DateISO.getSeconds();
  var today_mmmin = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + MM + ":" + ss;
  return today_mmmin;
}
