const D_DATE = "2024-09-05T00:00:00";
const D_DATE_OBJ = new Date(D_DATE);

function toTwoDigit(number) {
  return parseInt(number) < 10 ? `0${number}` : `${number}`;
}

const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

const dayOfweekObj = {
  0: "일",
  1: `월`,
  2: `화`,
  3: `수`,
  4: `목`,
  5: `금`,
  6: `토`,
  7: `일`,
};

const getDayOfWeek = (day) => {
  return dayOfweekObj[day];
};

const formatDDayClock = ({ hours, minutes, seconds }) => {
  return `${toTwoDigit(hours)}:${toTwoDigit(minutes)}:${toTwoDigit(seconds)}`;
};

const renderDDayClock = () => {
  const h2_clock = document.querySelector(".js-clock");

  function runDDayClock() {
    const now = new Date();
    const end = D_DATE_OBJ;
    const TIME_DISTANCE = end - now;
    // const days = Math.floor(TIME_DISTANCE / TIME.DAY);
    const hours = Math.floor((TIME_DISTANCE % TIME.DAY) / TIME.HOUR);
    const minutes = Math.floor((TIME_DISTANCE % TIME.HOUR) / TIME.MINUTE);
    const seconds = Math.floor((TIME_DISTANCE % TIME.MINUTE) / TIME.SECOND);
    h2_clock.innerHTML = formatDDayClock({ hours, minutes, seconds });
  }

  setInterval(runDDayClock, 1000);
};

window.addEventListener("DOMContentLoaded", () => renderDDayClock());
