const ref = {
  startButton: document.querySelector('button[data-start]'),
  stopButton: document.querySelector('button[data-stop]'),
  body: document.querySelector('body'),
};

ref.startButton.addEventListener('click', onButtonStartClick);
ref.stopButton.addEventListener('click', onButtonStopClick);

let intervalId = null;
let color = localStorage.getItem('bg-color');

changeColor();

function onButtonStartClick() {
  buttonDisableChange();
  intervalId = setInterval(() => {
    color = getRandomHexColor();
    changeColor();
  }, 1000);
}

function onButtonStopClick() {
  buttonDisableChange();
  clearInterval(intervalId);
}

function changeColor() {
  ref.body.style.backgroundColor = color;
  localStorage.setItem('bg-color', color);
}

function buttonDisableChange() {
  ref.startButton.disabled = !ref.startButton.disabled;
  ref.stopButton.disabled = !ref.stopButton.disabled;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
