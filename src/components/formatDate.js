export default function formatDate(todayISO) {
  var DateISO = new Date(todayISO);
  var dd = DateISO.getDate(); // 10
  var mm = DateISO.getMonth() + 1;
  var yyyy = DateISO.getFullYear();
  var today_mmmin = yyyy + "-" + mm + "-" + dd;
  return today_mmmin;
}
