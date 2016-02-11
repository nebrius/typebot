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
var positions = {};
var servos = {};
var opts;

// Initializes the servo control module
function init(board, options, callback) {

  // Store the options for use with move()
  opts = options;

  // Initialize the servos
  for (var servo in options.servos) {

    // Alias the servo config for easy access
    var servoConfig = options.servos[servo];

    // Store the start position as the current position
    positions[servo] = servoConfig.startPosition;

    // Create the servo instance
    servos[servo] = new five.Servo({
      pin: servoConfig.pin,
      isInverted: servoConfig.isInverted
    });

    // Move to the servo to the starting position
    servos[servo].to(positions[servo]);
  }

  // Wait for the servos to move to their starting positions
  setTimeout(callback, 1000);
}

// Move the servos
function move(destinations, callback) {

  // Find the largest servo angle change
  var largestChange = 0;
  for (var servo in destinations) {
    var delta = Math.abs(destinations[servo] - positions[servo]);
    if (delta > largestChange) {
      largestChange = delta;
    }
  }

  // If none of the servos need to move, short-circuit here
  if (largestChange === 0) {

    // We still need to call the callback, but we want the callback to always be
    // asynchronous, so we use process.nextTick to call it asynchronously.
    // For more information on why this is a good thing, read:
    // http://nodejs.org/api/process.html#process_process_nexttick_callback
    process.nextTick(callback);
    return;
  }

  // Calculate how long we should take to move, based on the largest change
  // in angle. This means that only this one servo will move at full speed.
  // All of the other servos will move at a slower rate so that all servos
  // inish at the same time.
  var duration = largestChange / opts.rate;

  // Move the servos to their destinations
  for (servo in destinations) {
    positions[servo] = destinations[servo];
    servos[servo].to(destinations[servo], duration);
  }

  // Wait until we are done and call the callback
  setTimeout(callback, duration + opts.settleTime);
}

// Export the methods so that typebot.js can use them
module.exports = {
  init: init,
  move: move
};
