// JavaScript source code

var controllerOptions = {};
var x;
var y;
var z;
var hand;
var fingers;
//var indexPose = [0, 0, 0];
var rawXMin = 5000;
var rawXMax = -5000;
var rawYMin = 5000;
var rawYMax = -5000;

var canvasX;
var canvasY;

Leap.loop(controllerOptions, function(frame)
{
    clear();
    HandleFrame(frame)

    //console.log(indexPose);

}
);


function HandleFrame(frame) {
    if (frame.hands.length == 1) {
        //    console.log(frame.hands)
        hand = frame.hands[0];

        HandleHand(hand)
    }
}

function HandleHand(hand) {
    fingers = hand.fingers;
    //console.log(fingers)
    for (var k = 3; k >= 0; k--) {
        for (var i = 0; i < fingers.length; i++) {
            var bone = fingers[i].bones[k];

            HandleBone(bone, 4 - k)
        }
    }
    
}

function HandleFinger(finger) {
    //var fingerPose = finger.tipPosition;
    //DrawCircle(fingerPose)

   for (var j = finger.bones.length - 1; j >= 0; j--) {
       var bone = finger.bones[j]
       var prox = finger.bones.length - 1 - j
       console.log(prox)
       HandleBone(bone, prox)
    }

    //console.log(finger)
}

function HandleBone(bone, prox) {
    var boneTipPose = bone.nextJoint;
    var boneBasePose = bone.prevJoint;
    DrawLine(processCoords(boneTipPose), processCoords(boneBasePose), prox)
}

function processCoords(coords) {
    x = coords[0];
    y = coords[1];
    z = coords[2];


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
    canvasY = window.innerHeight - (window.innerHeight / (rawYMax - rawYMin)) * (y - rawYMin);

    return [canvasX, canvasY, z]
}

function DrawLine(tipPose, basePose, prox) {
    
    strokeWeight(prox)
    stroke(tipPose[2] * 10)
    line(basePose[0], basePose[1], tipPose[0], tipPose[1])
}