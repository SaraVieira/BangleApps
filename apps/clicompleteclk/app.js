const storage = require('Storage');
const locale = require("locale");

const font = "12x20";
const fontsize = 1;
const fontheight = 19;

const marginTop = 10;
const marginLeftTopic = 3; // margin of topics
const marginLeftData = 68; // margin of data values

const topicColor = g.theme.dark ? "#fff" : "#000";
const textColor = g.theme.dark ? "#0f0" : "#080";

let hrtValue;
let hrtValueIsOld = false;
let localTempValue;
let weatherTempString;
let lastHeartRateRowIndex;

// timeout used to update every minute
var drawTimeout;
// schedule a draw for the next minute
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    drawAll(false);
  }, 60000 - (Date.now() % 60000));
}

function drawAll(drawInfoToo){
  let now = new Date();
  updateTime(now);
  if (drawInfoToo) {
    drawInfo(now);
  }
  queueDraw();
}

function updateTime(now){
  if (!Bangle.isLCDOn()) return;
  writeLineTopic("TIME", 1);
  writeLine(locale.time(now,1),1);
  if(now.getMinutes() == 0)
    drawInfo(now);
}

function drawInfo(now) {
  if (now == undefined) 
    now = new Date();

  let i = 2;

  writeLineTopic("DOWK", i);
  writeLine(locale.dow(now),i);
  i++;

  writeLineTopic("DATE", i);
  writeLine(locale.date(now,1),i);
  i++;

  /*
  writeLineTopic("BAT", i);
  const b = E.getBattery();
  writeLine(b + "%", i); // TODO make bars
  i++;
  */

  // weather
  var weatherJson = getWeather();
  if(weatherJson && weatherJson.weather){
    const currentWeather = weatherJson.weather;

    const weatherTempValue = locale.temp(currentWeather.temp-273.15);
    weatherTempString = weatherTempValue;
    writeLineTopic("WTHR", i);
    writeLine(currentWeather.txt,i);
    i++;

    writeLineTopic("TEMP", i);
    writeLine(weatherTempValue,i);
    i++;
  }

  // steps
  if (stepsWidget() != undefined) {
    writeLineTopic("STEP", i);
    const steps = stepsWidget().getSteps();
    writeLine(steps, i);
    i++;
  }

  drawHeartRate(i);
}

function drawHeartRate(i) {
  if (i == undefined)
    i = lastHeartRateRowIndex;
  writeLineTopic("HRTM", i);
  if (hrtValue != undefined) {
    if (!hrtValueIsOld)
      writeLine(hrtValue,i);
    else
      writeLine(hrtValue,i, topicColor);
  } else {
    writeLine("...",i);
  }
  lastHeartRateRowIndex = i;
}


function writeLineTopic(str, line) {
  var y = marginTop+line*fontheight;
  g.setFont(font,fontsize);
  g.setColor(topicColor).setFontAlign(-1,-1);

  g.clearRect(0,y,g.getWidth(),y+fontheight-1);
  g.drawString("[" + str + "]",marginLeftTopic,y);
}

function writeLine(str,line,pColor){
  if (pColor == undefined)
    pColor = textColor;
  var y = marginTop+line*fontheight;
  g.setFont(font,fontsize);
  g.setColor(pColor).setFontAlign(-1,-1);
  g.drawString(str,marginLeftData,y);
}

// EVENTS:

// turn on HRM when the LCD is unlocked
Bangle.on('lock', function(isLocked) {
  if (!isLocked) {
    Bangle.setHRMPower(1,"clicompleteclk");
    if (hrtValue == undefined)
      hrtValue = "...";
    else
      hrtValueIsOld = true;
    drawHeartRate();
  } else {
    hrtValueIsOld = true;
    Bangle.setHRMPower(0,"clicompleteclk");
  }
});

Bangle.on('lcdPower',function(on) {
  if (on) {
    drawAll(true);
  } else {
    hrtValueIsOld = true;
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
});

Bangle.on('HRM', function(hrm) {
  //if(hrm.confidence > 90){
    hrtValueIsOld = false;
    hrtValue = hrm.bpm;
    if (Bangle.isLCDOn())
      drawHeartRate();
  //} else {
  //  hrtValue = undefined;
  //}
});


function stepsWidget() {
  if (WIDGETS.activepedom !== undefined) {
    return WIDGETS.activepedom;
  } else if (WIDGETS.wpedom !== undefined) {
    return WIDGETS.wpedom;
  }
  return undefined;
}

function getWeather() {
  let jsonWeather = storage.readJSON('weather.json');
  return jsonWeather;
}

g.clear();
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
drawAll(true);
