// JavaScript source code

nj.config.printThreshold = 1000;

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

var numSamples = 100;
var currentSample = 0;

var framesOfData = nj.zeros([5, 4, 6, numSamples]);

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

        var interactionBox = frame.interactionBox;

        HandleHand(hand, interactionBox)
    }
}

function HandleHand(hand, InteractionBox) {
    fingers = hand.fingers;
    //console.log(fingers)
    for (var k = 3; k >= 0; k--) {
        for (var i = 0; i < fingers.length; i++) {
            var bone = fingers[i].bones[k];
            var boneIndex = fingers[i].bones[k].type
            var fingerIndex = fingers[i].type
            HandleBone(bone, boneIndex, fingerIndex, InteractionBox)
        }
    }
    
}


function HandleBone(bone, boneIndex, fingerIndex, InteractionBox) {
   // var boneTipPose = bone.nextJoint;
    //var boneBasePose = bone.prevJoint;

    // Normalizing coordinates for knn
    var normalizedPrevJoint = InteractionBox.normalizePoint(bone.prevJoint, clamping = true)
    var normalizedNextJoint = InteractionBox.normalizePoint(bone.nextJoint, clamping = true)

    framesOfData.set(fingerIndex, boneIndex, 0, currentSample, normalizedPrevJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 1, currentSample, normalizedPrevJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 2, currentSample, normalizedPrevJoint[2]);

    framesOfData.set(fingerIndex, boneIndex, 3, currentSample, normalizedNextJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 4, currentSample, normalizedNextJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 5, currentSample, normalizedNextJoint[2]);


    var transTip = ScaleCoordinates(normalizedNextJoint);
    var transBase = ScaleCoordinates(normalizedPrevJoint);

      
    DrawLine(transTip, transBase, boneIndex)
}

function ScaleCoordinates(normalizedPosition) {

    canvasX = window.innerWidth * normalizedPosition[0];
    canvasY = window.innerHeight * (1 - normalizedPosition[1]);

    return [canvasX, canvasY, z]
}

function DrawLine(tipPose, basePose, boneIndex) {
    
    //var green = Math.abs(Math.round(255/tipPose[2]));
    //console.log(green);
    strokeWeight((4 - boneIndex) * 5);

    if (currentNumHands == 1){
        stroke(0, (4-boneIndex) * 50, 0);
    }
    else{
        stroke((4-boneIndex) * 50, 0, 0);
    }
    
    line(basePose[0], basePose[1], tipPose[0], tipPose[1]);
}

function RecordData() {
    if (currentNumHands == 2 && previousNumHands == 2){
        //background(0)
        console.log(framesOfData.toString());

        currentSample++
        if (currentSample == numSamples) {
            currentSample = 0;
        }
    }
}