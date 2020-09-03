// JavaScript source code

var controllerOptions = {};
var i = 0;
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;

Leap.loop(controllerOptions, function(frame)
{
    console.log(i)
    i += 1;

    circle(x, y, 50)
}
);