const canvasWidth = 920
const canvasHeight = 700

const offset = 6
const stringOffset = 8
const fretboardHeight = 200
const fretDistance = (canvasWidth - offset*2) / 12
const position = 5
const startingFret = 5
const pentatonic = false

const _do = '#c40233'
const re = '#e16b1a'
const mi = '#eac100'
const fa = '#00a368'
const so = '#00b2b0'
const la = '#0088bf'
const si = '#624579'

const maxInterval = 3

let nextKlack = 0
let beat = 0
let current
let beats = 4

let notes = getNotes()

function getNotes() {
  const n = []
  
  switch (position) {
    case 3:
      n.push(0, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 16)
  
      if (!pentatonic) n.push(1, 5, 8, 11, 15)

      break
    case 5:
      n.push(0, 2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 16)
  
      if (!pentatonic) n.push(1, 5, 8, 12, 15)

      break
  }
  
  return n
}

function hexToRgb(hex, alpha) {
    hex = hex.replace('#', '');

    var bigint = parseInt(hex, 16);

    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return color(r, g, b, alpha);
}

function getStringY(nr) {
  return canvasHeight/2 - fretboardHeight/2 + stringOffset + (fretboardHeight - stringOffset*2)/5*nr
}

function preload() {
  high = loadSound('Ping Hi.wav')
  high.playMode('restart')
  
  low = loadSound('Ping Low.wav')
  low.playMode('restart')
}

function setSignature() {
  beat = 0
  
  switch(sel.value()) {
    case '4/4':
      beats = 4
      break
    case '3/4':
      beats = 3
      break
  }
}

function setup() {
  tempoSlider = createSlider(40, 180, 100);
  tempoSlider.position(10, 50);

  sel = createSelect();
  sel.position(200, 50);
  sel.option('4/4');
  sel.option('3/4');
  sel.changed(setSignature);

  createCanvas(canvasWidth, canvasHeight);
  
  current = round(random(0, 16))
}

function draw() {
  background(230);
  
  metronome()
  
  fretboard()
  
  shape()
}

function metronome() {
  let timeNow = millis()
      
  if (timeNow > nextKlack) {
    if (beat % beats === 0 ) {
      high.play()   
    } else {
      low.play()
    }

    
    let newCurrent = round(random(max(current - maxInterval, 0), min(current + maxInterval, max(notes))))

    while(newCurrent  === current || !notes.includes(newCurrent)) {
      newCurrent = round(random(max(current - maxInterval, 0), min(current + maxInterval, max(notes))))
    }

    current = newCurrent
    
  	nextKlack = timeNow + 60000/tempoSlider.value()
    
    beat++
  }
  
  fill(0)
  noStroke()
  textSize(35)
  text('Signature', 200, 35)
  text(`${tempoSlider.value()} bpm`, 10, 35)
  text(`${nf(floor(millis() / 1000 / 60), 2)}:${nf(floor(millis() / 1000) % 60, 2)}`, canvasWidth - 100, 35)
}

function fretboard() { 
  fill('#2e1300')
  
  noStroke()
  
  rect(0, canvasHeight/2 - fretboardHeight/2, canvasWidth, fretboardHeight)
  
  fill('#f2f2f2')
  
  stroke('#f2f2f2')
  
  strokeWeight(4.5)

  line(offset, canvasHeight/2 - fretboardHeight/2, offset, canvasHeight/2 + fretboardHeight/2)
  
  strokeWeight(3.5)
  
  const indicatorD = 18
  
  for (let i = 1; i < 13; i++) {
    const fretX = offset + i * fretDistance
    
    noStroke()
    
    fill(100)
    
    if ([3, 5, 7, 9].includes(i)) {
      circle(
        fretX - fretDistance/2, 
        canvasHeight/2, 
        indicatorD
      )
    }
    
    if (i === 12) {
      circle(
        fretX - fretDistance/2, 
        canvasHeight/2 - fretboardHeight/6, 
        indicatorD
      )
      
      circle(
        fretX - fretDistance/2, 
        canvasHeight/2 + fretboardHeight/6, 
        indicatorD
      )
    }
    
    stroke('#f2f2f2')

    line(
      fretX, 
      canvasHeight/2 - fretboardHeight/2, 
      fretX, 
      canvasHeight/2 + fretboardHeight/2
    )
  }  
    
  stroke(220)
  
  for (let i = 0; i < 6; i++) {
    const stringY = getStringY(i)
    
    strokeWeight(1 + i*.4)
    
    line(0, stringY, canvasWidth, stringY)
  }
  
}

function shape() {
  noStroke()

  switch(position) {
    case 3:
      position3()
      break
    case 5:
      position5()
      break
  }
}
  
function position3() {
  dot(mi, startingFret, 6, current === 0)
  
  if (!pentatonic) dot(fa, startingFret + 1, 6, current === 1)
  
  dot(so, startingFret + 3, 6, current === 2)
  dot(la, startingFret, 5, current === 3)
  
  if (!pentatonic) dot(si, startingFret + 2, 5, current === 4)
  
  dot(_do, startingFret + 3, 5, current === 5)
  dot(re, startingFret, 4, current === 6)
  dot(mi, startingFret + 2, 4, current === 7)
  
  if (!pentatonic) dot(fa, startingFret + 3, 4, current === 8)
  
  dot(so, startingFret, 3, current === 9)
  dot(la, startingFret + 2, 3, current === 10)
  
  if (!pentatonic) dot(si, startingFret, 2, current === 11)
  
  dot(_do, startingFret + 1, 2, current === 12)
  dot(re, startingFret + 3, 2, current === 13)
  dot(mi, startingFret, 1, current === 14)
  
  if (!pentatonic) dot(fa, startingFret + 1, 1, current === 15)
  
  dot(so, startingFret + 3, 1, current === 16)
}
  
function position5() {
  dot(la, startingFret, 6, current === 0)
  
  if (!pentatonic) dot(si, startingFret + 2, 6, current === 1)
  
  dot(_do, startingFret + 3, 6, current === 2)
  dot(re, startingFret, 5, current === 3)
  dot(mi, startingFret + 2, 5, current === 4)
  
  if (!pentatonic) dot(fa, startingFret + 3, 5, current === 5)
  
  dot(so, startingFret, 4, current === 6)
  dot(la, startingFret + 2, 4, current === 7)
  
  if (!pentatonic) dot(si, startingFret - 1, 3, current === 8)
  
  dot(_do, startingFret, 3, current === 9)
  dot(re, startingFret + 2, 3, current === 10)
  dot(mi, startingFret, 2, current === 11)
  
  if (!pentatonic) dot(fa, startingFret + 1, 2, current === 12)
  
  dot(so, startingFret + 3, 2, current === 13)
  dot(la, startingFret, 1, current === 14)
  
  if (!pentatonic) dot(si, startingFret + 2, 1, current === 15)
  
  dot(_do, startingFret + 3, 1, current === 16)
}
  
function dot(key, fret, string, active = false) { 
  fill(hexToRgb(key, 230))
  
  if (active) {
    strokeWeight(2.5)
    stroke(255)
  } else {
    strokeWeight(1.5)
    stroke(20)
  }
  
  circle(offset + fretDistance*fret - fretDistance/2, getStringY(string - 1), 30)
}
