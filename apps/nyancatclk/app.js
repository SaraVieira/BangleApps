var img = {
  width: 176,
  height: 176,
  bpp: 8,
  buffer: require("heatshrink").decompress(
    atob(
      "goA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4AQ64ABBzQA/AH6v/AH4A/V/4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A564ABIX4A/V/5C/AH5s/IX4A/AH6v/AH6s/WX4A/V/4A/AH6v/AH4A/WSoA/AH6v/AH4A/V/4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/ACPXAAJC/AH6v/AH4A/V/4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AGvXAAIOaAH4A/V/4A/AH6v/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AHHXAAJC/AH6v/AH4A/V/4AO2gATFE6u/AGSv8gAApU/6oVAFyv/V/6tv54ApWP6v/V/6v/VnO5AD6x/V/6v/V/6v/ABmUyiyXV/4AF4wASUCgjOV4yZQV/6v/V94AVV/4ACVCYAqV4anhymUWJKv/V/6vGSRKv/V/6v/ABiv/V/6vIACgdBAASvTDAi40V/6vSymUV/6vh6QATTyIiQV7YbBwIADWRivDAAQYEDISv/AGCvTAA6vOYwiv/gqo3V9IACV5oVHV/6v8RoivXBIITHV/6v/V/6v/UEQAHV5oAGWxaZKwKvJCZKv/VtivuGxKv/V9xrJV6gALV/6vbjwASV7wAGV8oAUV/6v/V/4AjVCYAZUAZwMV6eUyisjWWyv/V/6v/WURvNV6IAEV/6v/WBYAHV83X668PCJKv/V/6v/V/4ASi4AGWgyvgbQ4AJCJSv4Qo4AKVriv2BIiv/V7YXSABavLymUV6gAMCx6vwR7wAfV7oJEW6gcHV/6v7ABiv/V/6v8BggHDAwwHEV/6v4AASv/V/6v8ymUU46v/V/6tRV4yyMV4yLCTwqgDABwWHVlyvJNpIAJUSggLPQivRDxKv/V/6vPOQavZWJYASVuYABMyYAlN4KvEWJIARV/6v/V5x0EV/6v/VtZ3GAG6v/V/6v/V/6vpBI5cODBglYV+jKnRRyrCRLSv/V/6v/V/4A6VAQADBywnWErAA/V/6v/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AGHX65B/AH6v/AH4A/V/4A/AH6v/AH6v/IP4A/AH4A/AH4A/AH4A/AH4A/AGvXAAYHEBhQA/AH6v/AH4A/AH4A/AH4A/AH4A/AH4A/AEXX65B/AH6v/AH4A/V/4A/AH6v/AH6v/IP4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AE3XAAJC/AH6v/AH4A/V/4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AAvXAAIOaAH4A/V/4A/AH6v/ADA="
    )
  ),
};

let timer;

// timeout used to update every minute
var drawTimeout;

// schedule a draw for the next minute
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function () {
    drawTimeout = undefined;
    startDrawing();
  }, 60000 - (Date.now() % 60000));
}

function draw() {
  const d = new Date();

  var date = new Date();
  var timeStr = require("locale").time(date, 1);
  var dateStr = require("locale").date(date).toUpperCase();
  const middleWidth = g.getWidth() / 2;
  g.setFontAlign(0, 0, 0);

  g.setFont("6x8", 3);
  g.setColor(0xffff);

  g.drawString(timeStr, middleWidth, 130);

  g.setFont("6x8", 2);
  g.setColor(0xffff);
  g.drawString(dateStr, middleWidth, 160);

  queueDraw();
}

function startDrawing() {
  g.clear();
  g.drawImage(img);
  Bangle.drawWidgets();
  draw();
}

function stopDrawing() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

Bangle.on("lcdPower", (on) => {
  if (on) {
    startDrawing(); // draw immediately, queue redraw
  } else {
    // stop draw timer
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
});

Bangle.loadWidgets();
g.setTheme({ bg: "#0000ff", fg: "#fff", dark: true }).clear();
startDrawing();

// Show launcher when button pressed
Bangle.setUI("clock");
