const locale = require("locale");

let hour;
let minute;
let date;
let time;

let timer;

function draw() {
  const d = new Date();

  const newHour = ("0" + d.getHours()).substr(-2);
  const newMinute = ("0" + d.getMinutes()).substr(-2);
  const newTime = newHour + ":" + newMinute;
  const newDate = locale.date(d).trim();
  const middleWidth = g.getWidth() / 2;

  g.setFontAlign(0, 0, 0);

  if (newHour !== hour || newMinute !== minute) {
    g.setFont("6x8", 3);
    g.setColor(0x0000);
    g.drawString(time, middleWidth, 130);
    g.setColor(0xffff);
    g.drawString(newTime, middleWidth, 130);
    time = newTime;
    hour = newHour;
    minute = newMinute;
  }

  if (newDate !== date) {
    g.setFont("6x8", 2);
    g.setColor(0x0000);
    g.drawString(date, middleWidth, 160);
    g.setColor(0xffff);
    g.drawString(newDate, middleWidth, 160);
    date = newDate;
  }
}

function startDrawing() {
  hour = "";
  minute = "";
  date = "";
  time = "";
  g.setColor("#013265");
  g.fillRect(0, 0, 240, 240);
  g.drawImage(require("Storage").read("cat.img"));
  Bangle.drawWidgets();
  draw();
  timer = setInterval(draw, 1000);
}

function stopDrawing() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

Bangle.on("lcdPower", (on) => {
  stopDrawing();
  if (on) {
    startDrawing();
  }
});

Bangle.loadWidgets();
startDrawing();

// Show launcher when button pressed
Bangle.setUI("clock");
