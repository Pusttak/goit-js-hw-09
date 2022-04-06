import flatpickr from 'flatpickr';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  dataPicker: document.querySelector('input#datetime-picker'),
  buttonStart: document.querySelector('button[data-start]'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
};

refs.buttonStart.addEventListener('click', onButtonStartClick);

function onButtonStartClick() {
  timerStart();
}

const fp = flatpickr(refs.dataPicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDateHandles(selectedDates[0]);
  },
});

const buttonStartStatus = elementDisabled(refs.buttonStart);
const dataPickerStatus = elementDisabled(refs.dataPicker);

function timerStart() {
  buttonStartStatus(false);
  dataPickerStatus(false);
  timeCounter();
}

function timeCounter() {
  const selectedDate = fp.selectedDates[0].getTime();

  let intervalId = setInterval(() => {
    const currentTime = Date.now();
    const time = selectedDate - currentTime;

    if (time <= 0) {
      dataPickerStatus(true);
      Notify.success('Sol lucet omnibus');
      clearInterval(intervalId);

      return;
    }
    const { days, hours, minutes, seconds } = convertMs(time);
    updateTimerFace({ days, hours, minutes, seconds });
  }, 1000);
}

function selectedDateHandles(selectedDate) {
  if (Date.now() < selectedDate.getTime()) {
    buttonStartStatus(true);
  } else {
    buttonStartStatus(false);
    Notify.failure('Please choose a date in the future');
  }
}

function elementDisabled(element) {
  const elementStatus = function (status) {
    element.disabled = !status;
  };
  return elementStatus;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  refs.secondsField.textContent = seconds;
  refs.minutesField.textContent = minutes;
  refs.hoursField.textContent = hours;
  refs.daysField.textContent = days;
}
