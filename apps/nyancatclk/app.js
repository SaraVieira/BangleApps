const locale = require("locale");
var img = {
  width: 176,
  height: 176,
  bpp: 8,
  buffer: require("heatshrink").decompress(
    atob(
      "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"
    )
  ),
};
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
  g.drawImage(img);
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
