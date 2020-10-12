// JavaScript source code
//console.log(train4)

//Global variables
var controllerOptions = {};

var trainingCompleted = false;
var testingSampleIndex = 0;
var meanAccuracy = 0;
var numSamples = 100;

var previousNumHands = 0;
var currentNumHands = 0;

var controllerOptions = {};
var x;
var y;
var z;
var hand;
var fingers;

var canvasX;
var canvasY;

var framesOfData = nj.zeros([5, 4, 6]);

//var predictedClassLabels = nj.zeros(numSamples)

// classifier
const knnClassifier = ml5.KNNClassifier();

Leap.loop(controllerOptions, function (frame) {
    clear();


    // Train if not 
    if (trainingCompleted == false) {
        Train();
    }

    currentNumHands = frame.hands.length;
    HandleFrame(frame)
    previousNumHands = currentNumHands;

    //Test();

}
);

function Train() {
    //console.log(train4)

    for (var i = 0; i < train4.shape[3]; i++) {
        var features = train4.pick(null, null, null, i).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 4);

        features = train6.pick(null, null, null, i).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 6);

    }

    trainingCompleted = true;
    console.log('Training is Complete')
}

function Test() {
    //console.log(test)

    CenterData()
    
    var currentTestingSample = framesOfData.reshape(1, 120);
    knnClassifier.classify(currentTestingSample.tolist(), GotResults);

    
}

function GotResults(err, result) {
    //console.log(testingSampleIndex, parseInt(result.label));

    testingSampleIndex++;

    var d = 6;
    meanAccuracy = ((testingSampleIndex - 1) * meanAccuracy + (result.label == d)) / testingSampleIndex

    console.log(testingSampleIndex, meanAccuracy, parseInt(result.label));
}

// Hand processing functions
function HandleFrame(frame) {

    if (frame.hands.length >= 1) {
        //    console.log(frame.hands)
        hand = frame.hands[0];

        var interactionBox = frame.interactionBox;

        HandleHand(hand, interactionBox)
        Test()
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

    framesOfData.set(fingerIndex, boneIndex, 0, normalizedPrevJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 1, normalizedPrevJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 2, normalizedPrevJoint[2]);

    framesOfData.set(fingerIndex, boneIndex, 3, normalizedNextJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 4, normalizedNextJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 5, normalizedNextJoint[2]);


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

    stroke((4 - boneIndex) * 50);

    line(basePose[0], basePose[1], tipPose[0], tipPose[1]);
}

function CenterData() {
    var currentMean = 0;
    xValues = framesOfData.slice([], [], [0, 6, 3])

    currentMean = xValues.mean();
    var horizontalShift = 0.5 - currentMean;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            currentX = framesOfData.get(i, j, 0);
            shiftedX = currentX + horizontalShift;
            framesOfData.set(i, j, 0, shiftedX)

            currentX = framesOfData.get(i, j, 3);
            shiftedX = currentX + horizontalShift;
            framesOfData.set(i, j, 3, shiftedX)
        }
    }

    yValues = framesOfData.slice([], [], [1, 6, 3])
    currentMean = yValues.mean();
    var verticalShift = 0.5 - currentMean;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            currentY = framesOfData.get(i, j, 1);
            shiftedY = currentY + verticalShift;
            framesOfData.set(i, j, 1, shiftedY)

            currentY = framesOfData.get(i, j, 4);
            shiftedY = currentY + verticalShift;
            framesOfData.set(i, j, 4, shiftedY)
        }
    }

    zValues = framesOfData.slice([], [], [2, 6, 3])
    currentMean = zValues.mean();
    var depthShift = 0.5 - currentMean;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            currentZ = framesOfData.get(i, j, 2);
            shiftedZ = currentZ + depthShift;
            framesOfData.set(i, j, 2, shiftedZ)

            currentZ = framesOfData.get(i, j, 5);
            shiftedZ = currentZ + depthShift;
            framesOfData.set(i, j, 5, shiftedZ)
        }
    }
}