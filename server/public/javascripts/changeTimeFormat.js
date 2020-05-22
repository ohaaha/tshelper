function toTime(time) {
  let date = new Date(parseInt(time) * 1000);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
  return Y+M+D+h+m;
}
function toTimestamp(time) {
  return Date.parse(time).toString().substr(0, 10);
}
module.exports.toTimestamp = toTimestamp;
module.exports.toTime = toTime;
