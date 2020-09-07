// JavaScript source code

var controllerOptions = {};
var x;
var y;
var z;
var hand;
var fingers;
var indexPose = [0, 0, 0];
var rawXMin = 5000;
var rawXMax = -5000;
var rawYMin = 5000;
var rawYMax = -5000;

var canvasX;
var canvasY;

Leap.loop(controllerOptions, function(frame)
{
    clear();
    HandelFrame(frame)

    //console.log(indexPose);

    x = indexPose[0];
    y = indexPose[1];
    z = indexPose[2];


    if (x < rawXMin) {
        rawXMin = x;
    }

    if (x > rawXMax) {
        rawXMax = x;
    }

    if (y < rawYMin) {
        rawYMin = y;
    }

    if (y > rawYMax) {
        rawYMax = y;
    }

    //var randx = (Math.random() * (2)) - 1;
    //var randy = (Math.random() * (2)) - 1;

    canvasX = (window.innerWidth / (rawXMax - rawXMin)) * (x - rawXMin);
    canvasY = (window.innerHeight / (rawYMax - rawYMin)) * (y - rawYMin);

    console.log(canvasX, canvasY)

    circle(canvasX, window.innerHeight-canvasY, 50)
}
);


function HandelFrame(frame) {
    if (frame.hands.length == 1) {
        //    console.log(frame.hands)
        hand = frame.hands[0];

        HandelHand(hand)
    }
}

function HandelHand(hand) {
    fingers = hand.fingers;
    //console.log(fingers)
    
    HandelFinger(fingers)
}

function HandelFinger(fingers) {
    for (var i = 0; i < fingers.length; i++) {
        if (fingers[i].type == 1) {
            var index = fingers[i];
        }
    }

    indexPose = index.tipPosition;


    //console.log(indexPose)
}