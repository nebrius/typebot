/*
Copyright (c) 2016 Bryan Hughes <bryan@nebri.us>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var five = require('johnny-five');
var servocontrol = require('./servocontrol');

// This is the sequence of keys that are pressed. Each element in the array
// needs to correspond with an entry in the KEYS object.
var SEQUENCE = ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd'];
// var SEQUENCE = [ 'w' ];

// This is the rate that the servos should rotate at, measured in degrees per
// millisecond. 0.05 is a good value to start with.
var SERVO_RATE = 0.08; // 0.08

// This is the delay between movement steps. A delay gives everything a chance
// to settle and helps prevent overdriving the arm.
var STEP_SETTLE_TIME = 100; //100

// This is the basic servo config. Each key-value pair names and defines a
// servo. The port is the pin number on the Arduino header, and the
// defaultPosition is the position that the servo will start at when the app
// boots up.
var SERVO_CONFIG = {
  servos: {
    shoulder: {
      pin: 11,
      startPosition: 90,
      isInverted: false
    },
    elbow: {
      pin: 10,
      startPosition: 60,
      isInverted: false
    },
    wrist: {
      pin: 9,
      startPosition: 30,
      isInverted: true
    }
  },
  rate: SERVO_RATE,
  settleTime: STEP_SETTLE_TIME
};

// These are the keys on the keyboard, and the position of each
// servo when they are *pressing* the key
var KEYS = {
  a: { shoulder: 125, elbow: 19, wrist: 87 },
  b: { shoulder: 88, elbow: 21, wrist: 62 },
  c: { shoulder: 105, elbow: 21, wrist: 65 },
  d: { shoulder: 100, elbow: 14, wrist: 111 },
  e: { shoulder: 100, elbow: 15, wrist: 103 },
  f: { shoulder: 107, elbow: 21, wrist: 74 },
  g: { shoulder: 100, elbow: 21, wrist: 72 },
  h: { shoulder: 82, elbow: 15, wrist: 115 },
  i: { shoulder: 81, elbow: 20, wrist: 79 },
  j: { shoulder: 84, elbow: 21, wrist: 70 },
  k: { shoulder: 77, elbow: 21, wrist: 71 },
  l: { shoulder: 62, elbow: 14, wrist: 110 },
  m: { shoulder: 70, elbow: 21, wrist: 65 },
  n: { shoulder: 78, elbow: 21, wrist: 63 },
  o: { shoulder: 66, elbow: 14, wrist: 103 },
  p: { shoulder: 68, elbow: 20, wrist: 83 },
  q: { shoulder: 124, elbow: 16, wrist: 98 },
  r: { shoulder: 96, elbow: 13, wrist: 107 },
  s: { shoulder: 120, elbow: 20, wrist: 82 },
  t: { shoulder: 102, elbow: 20, wrist: 81 },
  u: { shoulder: 88, elbow: 21, wrist: 78 },
  v: { shoulder: 97, elbow: 21, wrist: 63 },
  w: { shoulder: 107, elbow: 14, wrist: 102 },
  x: { shoulder: 113, elbow: 21, wrist: 68 },
  y: { shoulder: 95, elbow: 20, wrist: 79 },
  z: { shoulder: 120, elbow: 21, wrist: 72 }
};

function run() {

  // Define the states
  var STATE_IDLE = 0;
  var STATE_MOVING = 1;
  var STATE_PRESSING = 2;
  var STATE_RELEASING = 3;

  // State machine information
  var sequencePosition = -1;
  var state = STATE_IDLE;
  var key;

  function tick() {
    switch(state) {

      case STATE_IDLE:

        // Get the next key
        sequencePosition++;
        key = KEYS[SEQUENCE[sequencePosition]];
        if (!key) {
          process.exit();
        }

        // Move the arm to resting above the key
        state = STATE_MOVING;
        servocontrol.move({
          'shoulder': key.shoulder,
          'elbow': key.elbow + 10,
          'wrist': key.wrist - 5
        }, tick);
        break;

      // Press the key
      case STATE_MOVING:
        state = STATE_PRESSING;
        servocontrol.move({
          'elbow': key.elbow,
          'wrist': key.wrist
        }, tick);
        break;

      // Release the key
      case STATE_PRESSING:
        state = STATE_RELEASING;
        servocontrol.move({
          elbow: key.elbow + 10,
          wrist: key.wrist - 5
        }, tick);
        break;

      // Change to the idle state and pump the event loop
      case STATE_RELEASING:
        state = STATE_IDLE;
        tick();
        break;
    }
  }

  // Kickstart the event loop
  tick();
}

// Initialize the hardware
var board = new five.Board();
board.on('ready', function() {
  servocontrol.init(board, SERVO_CONFIG, run);
});
