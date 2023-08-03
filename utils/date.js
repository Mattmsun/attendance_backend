const getFormatDate = (date) => {
  // const today = new Date();
  // const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  const dateNum = new Date(date);
  const dd = dateNum.getDate();
  const mm = dateNum.getMonth() + 1;
  const yyyy = dateNum.getFullYear();
  let formatDate = yyyy + "-" + mm + "-" + dd;
  if (mm < 10) {
    formatDate = yyyy + "-0" + mm + "-" + dd;
  }
  return formatDate;
};
//
const getTomorrow = (date) => {
  return new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
};
//input : 00:00
const getSeconds = (time) => {
  const timeArray = time.split(":");
  return timeArray[0] * 3600 + timeArray[1] * 60;
};

function parseDate(str) {
  var mdy = str.split("-");
  return new Date(mdy[0], mdy[1] - 1, mdy[2]);
}
function daysBetweenTwo(first, second) {
  return Math.round(
    (parseDate(second) - parseDate(first)) / (1000 * 60 * 60 * 24)
  );
}

const isActivityEndFirstDay = (startDate, endTime) => {
  const start = Date.parse(`${getFormatDate(startDate)} ${endTime}`);
  return Date.now() > start;
};
const getMongodbDateFormat = (date) => {
  return new Date(date).toUTCString();
};
module.exports = { isActivityEndFirstDay, getMongodbDateFormat, getFormatDate };
