// JavaScript source code

var controllerOptions = {};
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;

Leap.loop(controllerOptions, function(frame)
{
    clear();

    console.log(frame.hands)

    var randx = (Math.random() * (2)) - 1;
    var randy = (Math.random() * (2)) - 1;

    circle(x + randx, y + randy, 50)
}
);