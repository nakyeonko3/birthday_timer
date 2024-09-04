const D_DATE = "2024-09-04T21:13:00";
const D_DAY_CLOCK_ELEM_NAME = ".js-clock";
const CAKE_CONTAINER_ELEM_NAME = ".cakeSvg-container";

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
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};

const getDayOfWeek = (day) => dayOfweekObj[day];

const formatDDayClock = ({ hours, minutes, seconds }) =>
  `${toTwoDigit(hours)}:${toTwoDigit(minutes)}:${toTwoDigit(seconds)}`;

const hideClock = () => {
  const clockElement = document.querySelector(D_DAY_CLOCK_ELEM_NAME);
  clockElement.classList.add("disable");
};

const showCakeSVG = () => {
  const cakeSVGContainer = document.querySelector(CAKE_CONTAINER_ELEM_NAME);
  cakeSVGContainer.classList.remove("disable");
};

const renderDDayClock = () => {
  const clockElement = document.querySelector(D_DAY_CLOCK_ELEM_NAME);
  const end = new Date(D_DATE);

  if (isNaN(end.getTime())) {
    console.error("Invalid date format");
    return;
  }

  function runDDayClock() {
    const now = new Date();
    const time_distance = end - now;

    if (time_distance <= 0) {
      clearInterval(timerInterval);
      hideClock();
      showCakeSVG();
      return;
    }

    const hours = Math.floor((time_distance % TIME.DAY) / TIME.HOUR);
    const minutes = Math.floor((time_distance % TIME.HOUR) / TIME.MINUTE);
    const seconds = Math.floor((time_distance % TIME.MINUTE) / TIME.SECOND);

    clockElement.textContent = formatDDayClock({ hours, minutes, seconds });
  }

  const timerInterval = setInterval(runDDayClock, 1000);
};

window.addEventListener("DOMContentLoaded", renderDDayClock);
