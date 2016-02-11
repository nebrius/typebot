TypeBot
=======

TypeBot is a NodeBot that can type on a keyboard. This folder contains the source code for TypeBot and two helper applications. To run these examples, first install the dependencies:

```
npm install
```

### TypeBot

To run TypeBot, connect your arm's Arduino and run:

```
node typebot.js
````

For more details on TypeBot, be sure to read the make book!

### Aligning Servos

It is often necessary when working on the arm to remove and re-attach segments. Doing so requires that the arm segment be re-attached at the appropriate angle, however. The align servos helper app will set all servos to 90 degrees. In practice, it's pretty easy to eyeball a 90 degree angle, so this makes it easy to re-assemble the arm. To the align servos app, connect the arm's Arduino and run:

```
node align_servos.js
```

### Generating Servo Angle Estimates

One of the trickiest parts of creating TypeBot is coming up with the initial estimate of servo angles. This app will generate estimates for all of the servos for each key. It uses a set of parameters about the keyboard and uses some basic Trig formulas to calculate an estimate of the angles. To generate the angle estimates, first edit the constants defined at the top of "generate_angle_estimates.js" if need be. Then run:

```
node generate_angle_estimates.js
```

License
=======

The MIT License (MIT)

Copyright (c) 2016 Bryan Hughes <bryan@nebri.us>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
