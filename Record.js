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

var previousNumHands = 0;
var currentNumHands = 0;

var oneFrameOfData = nj.zeros([5, 4, 6]);

Leap.loop(controllerOptions, function(frame)
{
    clear();

    currentNumHands = frame.hands.length;
    HandleFrame(frame)
    RecordData()
    previousNumHands = currentNumHands;
    

}
);


function HandleFrame(frame) {
    
    if (frame.hands.length >= 1) {
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
            var boneIndex = fingers[i].bones[k].type
            var fingerIndex = fingers[i].type
            HandleBone(bone, boneIndex, fingerIndex)
        }
    }
    
}


function HandleBone(bone, boneIndex, fingerIndex) {
    var boneTipPose = bone.nextJoint;
    var boneBasePose = bone.prevJoint;
    var transTip = processCoords(boneTipPose);
    var transBase = processCoords(boneBasePose);

    oneFrameOfData.set(fingerIndex, boneIndex, 0, transBase[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 1, transBase[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 2, transBase[2]);

    oneFrameOfData.set(fingerIndex, boneIndex, 3, transTip[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, transTip[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, transTip[2]);

    
    DrawLine(transTip, transBase, boneIndex)
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

function DrawLine(tipPose, basePose, boneIndex) {
    
    //var green = Math.abs(Math.round(255/tipPose[2]));
    //console.log(green);
    strokeWeight((4 - boneIndex) * 2);

    if (currentNumHands == 1){
        stroke(0, (4-boneIndex) * 50, 0);
    }
    else{
        stroke((4-boneIndex) * 50, 0, 0);
    }
    
    line(basePose[0], basePose[1], tipPose[0], tipPose[1]);
}

function RecordData() {
    if (currentNumHands == 1 && previousNumHands == 2){
        background(0)
        console.log(oneFrameOfData.toString());
    }
}