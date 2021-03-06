// JavaScript source code
//console.log(train4)

//Global variables
var controllerOptions = {};

var trainingCompleted = false;
var testingSampleIndex = 0;
var meanAccuracy = 0;
var numSamples = 100;

var username;

var digitToShow = 0;
var timeSinceLastDigitChange = new Date();

var num1 = 0;
var addSub = 0;

var previousNumHands = 0;
var currentNumHands = 0;

var programState = 0;

var controllerOptions = {};
var x;
var y;
var z;
var hand;
var fingers;

var canvasX;
var canvasY;

// Second hand functions
var predictedDigit = 0
var pause = false

var framesOfData1 = nj.zeros([5, 4, 6]);
var framesOfData2 = nj.zeros([5, 4, 6]);

var prevData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currentData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var userAttemps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var correctAttemps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var highScoreList = {};

var ctx = document.getElementById('userChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
            //label: 'My First dataset',
            backgroundColor: 'red',
            data: prevData
        },
        {
            //label: 'My First dataset',
            backgroundColor: 'blue',
            data: currentData
        }]
    },

    // Configuration options go here
    options: {
        barValueSpacing: 20,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                }
            }]
        },
        legend: {
            display: false
        }
    }
});

//var digitsBeingWorkedOn = [0];
var digitsBeingWorkedOn = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var digitIndex = 0;

var timeSinceChangeInSeconds = 0;
var timeToChange = 5;

//var predictedClassLabels = nj.zeros(numSamples)

// classifier
const knnClassifier = ml5.KNNClassifier();

Leap.loop(controllerOptions, function (frame) {
    clear();
    chart.update();
    //console.log(pause)
    if (username != null) {
        updateScores();
    }
    
    currentNumHands = frame.hands.length;
    DetermineState(frame)
    if (programState == 0) {
        HandelState0(frame);
    }
    else if (programState == 1) {
        HandelState1(frame);
    }
    else if (programState == 2) {
        HandelState2(frame);
    }
    
    previousNumHands = currentNumHands;

}
);

function DetermineState(frame) {
    //console.log(programState)
    if (frame.hands.length == 0) {
        programState = 0
    }
    else if (HandIsUncentered()) {
        programState = 1
    }
    else {
        programState = 2
    }
}

function HandIsUncentered() {
    var left = HandIsTooFarToTheLeft()
    var right = HandIsTooFarToTheRight()
    var up = HandIsTooFarToTheTop()
    var down = HandIsTooFarToTheBottom()
    var push = HandIsTooFarOut()
    var pull = HandIsTooFarIn()


    //print(left,  right,  up,  down, push, pull)
    //console.log(left, right, up, down, push, pull)
    return left || right || up || down || push || pull
    //return left && right && up && down && push && pull
}

function HandIsTooFarToTheLeft() {
    var currentMean = 0;
    xValues = framesOfData1.slice([], [], [0, 6, 3])

    currentMean = xValues.mean();

    if (currentMean < 0.25) {
        return true
    }
    else {
        return false
    } 
}

function HandIsTooFarToTheRight() {
    var currentMean = 0;
    xValues = framesOfData1.slice([], [], [0, 6, 3])

    currentMean = xValues.mean();

    if (currentMean > 0.75) {
        return true
    }
    else {
        return false
    }
}

function HandIsTooFarToTheTop() {
    var currentMean = 0;
    yValues = framesOfData1.slice([], [], [1, 6, 3])

    currentMean = yValues.mean();

    if (currentMean > 0.75) {
        return true
    }
    else {
        return false
    }
}

function HandIsTooFarToTheBottom() {
    var currentMean = 0;
    yValues = framesOfData1.slice([], [], [1, 6, 3])

    currentMean = yValues.mean();

    if (currentMean < 0.25) {
        return true
    }
    else {
        return false
    }
}

function HandIsTooFarOut() {
    var currentMean = 0;
    zValues = framesOfData1.slice([], [], [2, 6, 3])

    currentMean = zValues.mean();

    if (currentMean > 0.75) {
        return true
    }
    else {
        return false
    }
}

function HandIsTooFarIn() {
    var currentMean = 0;
    zValues = framesOfData1.slice([], [], [2, 6, 3])

    currentMean = zValues.mean();

    if (currentMean < 0.25) {
        return true
    }
    else {
        return false
    }
}

function HandelState0(frame) {
     // Train if not 
     if (trainingCompleted == false) {
       Train();
     }
    DrawImageToHelpUserPutTheirHandOverTheDevice()
}

function HandelState1(frame) {
    //console.log('State 1')
    HandleFrame(frame)
    if (HandIsTooFarToTheLeft()) {
        DrawArrowRight()
    }
    else if (HandIsTooFarToTheRight()) {
        DrawArrowLeft()
    }
    else if (HandIsTooFarToTheTop()) {
        DrawArrowDown()
    }
    else if (HandIsTooFarToTheBottom()) {
        DrawArrowUp()
    }
    else if (HandIsTooFarOut()) {
        DrawArrowIn()
    }
    else if (HandIsTooFarIn()) {
        DrawArrowOut()
    }
    //Test()
}

function HandelState2(frame) {
    if (pause) {
        drawPause()
        drawPredictedDigit()
    }
    HandleFrame(frame)
    //console.log(digitToShow, getNumberOfAttemps(), getNumberOfAccuracys(), timeSinceChangeInSeconds)
    if ((digitsBeingWorkedOn.length == 10) && (currentData[digitToShow] > 0.5)) {
        DrawLowerRightPanelMath()
    }
    else if ((getNumberOfAccuracys() > .5) && (getNumberOfAttemps() >= 3) && (timeSinceChangeInSeconds < timeToChange)) {
        DrawLowerRightPanelDigit()
    }
    else if ((getNumberOfAccuracys() > .25) && (getNumberOfAttemps() >= 2) && (timeSinceChangeInSeconds < timeToChange/2)) {
        DrawLowerRightPanel()
    }
    else if ((getNumberOfAccuracys() > .25) && (getNumberOfAttemps() >= 2) && (timeSinceChangeInSeconds > timeToChange/2)) {
        DrawLowerRightPanelDigit()
    }
    else {
        DrawLowerRightPanel()
    }
    
    
    Test()
    
    DetermineWhetherToSwitchDigits()
}

function DetermineWhetherToSwitchDigits() {
    if (TimeToSwitchDigits()) {
        userAttemps[digitToShow]++
        if (meanAccuracy >= 0.5) {
            correctAttemps[digitToShow]++
        }

        //Update Current data
        currentData[digitToShow] = (correctAttemps[digitToShow] / userAttemps[digitToShow]) * 100;
        console.log(currentData)
        SwitchDigits()
    }
}

function DetermineWhetherToAddDigit() {
    if ((meanAccuracy > .7) && (getNumberOfAttemps() >= 1)) {
        if (digitsBeingWorkedOn.length < 10) {
            digitsBeingWorkedOn.push(digitsBeingWorkedOn.length)
            return true
        }
    }
}

function SwitchDigits() {
    UpdateAttempsAndAccuracy()

    if ((digitsBeingWorkedOn.length == 10) && (getNumberOfAttemps() >= 2)) {
        digitIndex = Math.floor(Math.random() * 10);
        num1 = Math.floor(Math.random() * 10);
        addSub = Math.floor(Math.random() * 2)
    }
    else {
        if (digitIndex == digitsBeingWorkedOn.length - 1) {
            
            if (DetermineWhetherToAddDigit()) {
                digitIndex++
            }
            else {
                digitIndex = 0
            }
        }
        else {
            digitIndex++
        }
    }
    digitToShow = digitsBeingWorkedOn[digitIndex]
    timeSinceLastDigitChange = new Date();
    testingSampleIndex = 0;
    meanAccuracy = 0;

    if (getNumberOfAccuracys() > .2) {
        timeToChange = 5 * (1 - getNumberOfAccuracys()/3)
    }
    else {
        timeToChange = 5;
    }
}

function TimeToSwitchDigits() {
    if (pause) {
        timeSinceLastDigitChange = new Date()
        return false
    }

    else {
        var currentTime = new Date();
        var timeSinceChangeInMilliseconds = currentTime - timeSinceLastDigitChange;
        timeSinceChangeInSeconds = timeSinceChangeInMilliseconds / 1000;

        if (timeSinceChangeInSeconds > timeToChange) {
            return true
        }
        else {
            return false
        }
    }
}

function DrawLowerRightPanel() {
    if (digitToShow == 9) {
        image(digit9, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 8) {
        image(digit8, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 7) {
        image(digit7, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 6) {
        image(digit6, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 5) {
        image(digit5, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 4) {
        image(digit4, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 3) {
        image(digit3, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 2) {
        image(digit2, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    } 
    else if (digitToShow == 1) {
        image(digit1, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
    else if (digitToShow == 0) {
        image(digit0, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
    }
}

function DrawLowerRightPanelDigit() {
    if (digitToShow == 9) {
        //image(d9, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(9, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 8) {
        //image(d8, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(8, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 7) {
        //image(d7, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(7, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 6) {
        //image(d6, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(6, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 5) {
        //image(d5, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(5, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 4) {
        //image(d4, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(4, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 3) {
        //image(d3, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(3, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 2) {
        //image(d2, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(2, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 1) {
        //image(d1, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(1, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    else if (digitToShow == 0) {
        //image(d0, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 3, window.innerHeight / 3)
        fill(0)
        noStroke()
        textSize(300)
        text(0, 3 * window.innerWidth / 4, 3* window.innerHeight / 4)
    }
}

function DrawLowerRightPanelMath() {

    
    //Add
    if (addSub == 0) {
        var num2 = digitToShow - num1
        fill(0)
        noStroke()
        var prob = String(num1 + ' + ' + num2 + ' =');
        textSize(120)
        text(prob, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }
    //subtract
    else {
        var num2 = num1 - digitToShow
        fill(0)
        noStroke()
        var prob = String(num1 + ' - ' + num2 + ' =');
        textSize(120)
        text(prob, 3 * window.innerWidth / 4, 3 * window.innerHeight / 4)
    }

}

function drawPause() {
    image(pauseIm, 3 * window.innerWidth / 8, 3 * window.innerHeight / 8, window.innerWidth / 8, window.innerHeight / 8)
}

function drawPredictedDigit() {
    fill(0)
    noStroke()
    textSize(300)
    text(predictedDigit,  window.innerWidth / 4, window.innerHeight / 4)
}

function DrawArrowRight() {
    image(rightArrowImg, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2)
}

function DrawArrowLeft() {
    image(leftArrowImg, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2)
}

function DrawArrowUp() {
    image(upArrowImg, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2)
}

function DrawArrowDown() {
    image(downArrowImg, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2)
}

function DrawArrowIn() {
    image(inArrowImg, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2)
}

function DrawArrowOut() {
    image(outArrowImg, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2)
}

function DrawImageToHelpUserPutTheirHandOverTheDevice() {
    image(HandImg, 0, 0, window.innerWidth/2, window.innerHeight / 2)
}

function Train() {
    //console.log(train4)

    for (var i = 0; i < train4.shape[3]; i++) {
        //features = CenterData(train0.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 0);

        //features = CenterData(train1.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 1);

        //var features = CenterData(train2.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 2);

        features = CenterData(train3.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 3);

        //features = CenterData(train4.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 4);

        //features = CenterData(train6.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 6);

        //features = CenterData(train5.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 5);

        //features = CenterData(train7.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 7);

        //features = CenterData(train8.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 8);

        //features = CenterData(train9.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 9);

        features = CenterData(train0B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 0);

        features = CenterData(train1B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 1);

        features = CenterData(train2B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 2);

        features = CenterData(train3B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 3);

        features = CenterData(train4B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 4);

        features = CenterData(train6B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 6);

        features = CenterData(train5B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 5);

        features = CenterData(train7B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 7);

        features = CenterData(train8B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 8);

        features = CenterData(train9B.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 9);

        features = CenterData(trainStop.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 10);

        features = CenterData(trainStop2.pick(null, null, null, i)).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 10);

        

        //features = CenterData(train02.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 0);

        //features = CenterData(train12.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 1);

        //features = CenterData(train22.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 2);

        //features = CenterData(train32.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 3);

        //features = CenterData(train42.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 4);

        //features = CenterData(train62.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 6);

        //features = CenterData(train52.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 5);

        //features = CenterData(train72.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 7);

        //features = CenterData(train82.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 8);

        //features = CenterData(train92.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 9);

        //features = CenterData(train03.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 0);

        //features = CenterData(train13.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 1);

        //features = CenterData(train23.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 2);

        //features = CenterData(train33.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 3);

        //features = CenterData(train43.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 4);

        //features = CenterData(train63.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 6);

        //features = CenterData(train53.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 5);

        //features = CenterData(train73.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 7);

        //features = CenterData(train83.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 8);

        //features = CenterData(train93.pick(null, null, null, i)).reshape(1, 120);
        //knnClassifier.addExample(features.tolist(), 9);
        
    }

    trainingCompleted = true;
    console.log('Training is Complete')
}

function Test() {
    //console.log(test)

    frameOfData = CenterData(framesOfData1)
    
    var currentTestingSample = frameOfData.reshape(1, 120);
    knnClassifier.classify(currentTestingSample.tolist(), k=3, GotResults);

    
}

function Test2() {
    //console.log(test)

    frameOfData = CenterData(framesOfData2)

    var currentTestingSample = frameOfData.reshape(1, 120);
    knnClassifier.classify(currentTestingSample.tolist(), k = 3, GotResults);


}

function GotResults(err, result) {
    //console.log(parseInt(result.label));

    if (result.label == 10) {
        pause = true
    }

    else {
        testingSampleIndex++;

        predictedDigit = result.label;
        var correct = (result.label == digitToShow)
        meanAccuracy = ((testingSampleIndex - 1) * meanAccuracy + correct) / testingSampleIndex

        console.log(digitToShow, meanAccuracy, parseInt(result.label));
    //console.log(parseInt(result.label));
    }
   
}

// Hand processing functions
function HandleFrame(frame) {

    if (frame.hands.length == 1) {
        //    console.log(frame.hands)
        pause = false
        hand = frame.hands[0];

        var interactionBox = frame.interactionBox;

        HandleHand(hand, interactionBox, true)
    }
    else if (frame.hands.length > 1) {
        hand1 = frame.hands[0];
        hand2 = frame.hands[1];

        var interactionBox = frame.interactionBox;

        HandleHand(hand1, interactionBox, true)
        HandleHand(hand2, interactionBox, false)
    }
}

function HandleHand(hand, InteractionBox, draw) {
    fingers = hand.fingers;
    //console.log(fingers)
    for (var k = 3; k >= 0; k--) {
        for (var i = 0; i < fingers.length; i++) {
            var bone = fingers[i].bones[k];
            var boneIndex = fingers[i].bones[k].type
            var fingerIndex = fingers[i].type
            HandleBone(bone, boneIndex, fingerIndex, InteractionBox, draw)
        }
    }

}


function HandleBone(bone, boneIndex, fingerIndex, InteractionBox, draw) {
    // var boneTipPose = bone.nextJoint;
    //var boneBasePose = bone.prevJoint;

    // Normalizing coordinates for knn
    var normalizedPrevJoint = InteractionBox.normalizePoint(bone.prevJoint, clamping = true)
    var normalizedNextJoint = InteractionBox.normalizePoint(bone.nextJoint, clamping = true)

    if (draw) {
        framesOfData1.set(fingerIndex, boneIndex, 0, normalizedPrevJoint[0]);
        framesOfData1.set(fingerIndex, boneIndex, 1, normalizedPrevJoint[1]);
        framesOfData1.set(fingerIndex, boneIndex, 2, normalizedPrevJoint[2]);

        framesOfData1.set(fingerIndex, boneIndex, 3, normalizedNextJoint[0]);
        framesOfData1.set(fingerIndex, boneIndex, 4, normalizedNextJoint[1]);
        framesOfData1.set(fingerIndex, boneIndex, 5, normalizedNextJoint[2]);


        var transTip = ScaleCoordinates(normalizedNextJoint);
        var transBase = ScaleCoordinates(normalizedPrevJoint);


        DrawLine(transTip, transBase, boneIndex)
    }
    else {
        framesOfData2.set(fingerIndex, boneIndex, 0, normalizedPrevJoint[0]);
        framesOfData2.set(fingerIndex, boneIndex, 1, normalizedPrevJoint[1]);
        framesOfData2.set(fingerIndex, boneIndex, 2, normalizedPrevJoint[2]);

        framesOfData2.set(fingerIndex, boneIndex, 3, normalizedNextJoint[0]);
        framesOfData2.set(fingerIndex, boneIndex, 4, normalizedNextJoint[1]);
        framesOfData2.set(fingerIndex, boneIndex, 5, normalizedNextJoint[2]);

        Test2();
    }
}

function ScaleCoordinates(normalizedPosition) {

    canvasX = window.innerWidth/2 * normalizedPosition[0];
    canvasY = window.innerHeight/2 * (1 - normalizedPosition[1]);

    return [canvasX, canvasY, z]
}

function DrawLine(tipPose, basePose, boneIndex) {

    //var green = Math.abs(Math.round(255/tipPose[2]));
    //console.log(green);
    strokeWeight((4 - boneIndex) * 5);

    var green = meanAccuracy * 255;
    var red = (1 - meanAccuracy) * 255;

    //stroke((4 - boneIndex) * 50);
    stroke(red, green, 0)

    line(basePose[0], basePose[1], tipPose[0], tipPose[1]);
}

function CenterData(data) {
    var currentMean = 0;
    xValues = data.slice([], [], [0, 6, 3])

    currentMean = xValues.mean();
    var horizontalShift = 0.5 - currentMean;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            currentX = data.get(i, j, 0);
            shiftedX = currentX + horizontalShift;
            data.set(i, j, 0, shiftedX)

            currentX = data.get(i, j, 3);
            shiftedX = currentX + horizontalShift;
            data.set(i, j, 3, shiftedX)
        }
    }

    yValues = data.slice([], [], [1, 6, 3])
    currentMean = yValues.mean();
    var verticalShift = 0.5 - currentMean;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            currentY = data.get(i, j, 1);
            shiftedY = currentY + verticalShift;
            data.set(i, j, 1, shiftedY)

            currentY = data.get(i, j, 4);
            shiftedY = currentY + verticalShift;
            data.set(i, j, 4, shiftedY)
        }
    }

    zValues = data.slice([], [], [2, 6, 3])
    currentMean = zValues.mean();
    var depthShift = 0.5 - currentMean;

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            currentZ = data.get(i, j, 2);
            shiftedZ = currentZ + depthShift;
            data.set(i, j, 2, shiftedZ)

            currentZ = data.get(i, j, 5);
            shiftedZ = currentZ + depthShift;
            data.set(i, j, 5, shiftedZ)
        }
    }
    return data
}

// Web page functions
function SignIn() {
    username = document.getElementById('username').value;
    var list = document.getElementById('users');
    if (IsNewUser(username, list)) {
        CreateNewUser(username, list)
        CreateSignInItem(username, list)
        CreateAttempsItems(username, list)
        CreateAccuracyItems(username, list)
        digitsBeingWorkedOn = [0, 1];
        digitToShow = 0;
        for (var i = 0; i < 10; i++) {
            prevData[i] = 0;
            currentData[i] = 0


        }
    }
    else {
        ID = String(username) + "_signins"
        listItem = document.getElementById(ID);
        listItem.innerHTML = parseInt(listItem.innerHTML) + 1
        digitsBeingWorkedOn = [];
        digitToShow = 0;
        for (var i = 0; i < 10; i++) {
            ID = String(username) + "_" + String(i) + "_accuracy"
            listItem = document.getElementById(ID);
            prevData[i] = parseFloat(listItem.innerHTML) * 100;
            currentData[i] = 0

            if (parseFloat(listItem.innerHTML) > 0) {
                digitsBeingWorkedOn.push(i)
            }

        }
    }

    //listItemScore = document.getElementById("scores")
    //scores = JSON.parse(listItemScore.innerHTML);
    //scores[username] = 0;
    //scores.push({ username: 0 })
    //listItemScore.innerHTML = scores

    console.log(list.innerHTML)
    timeSinceLastDigitChange = new Date()
    return false;
}

function IsNewUser(username, list) {
    var users = list.children;
    var usernameFound = false;
    for (var i = 0; i < users.length; i++) {
        //console.log(i)
        if (users[i].innerHTML == username) {
            usernameFound = true
        }
    }

    return usernameFound == false
}

function CreateNewUser(username, list) {
    var item = document.createElement('li');
    item.innerHTML = String(username);
    item.id = String(username) + "_name";
    list.appendChild(item)
}

function CreateSignInItem(username, list) {
    var item = document.createElement('li');
    item.innerHTML = 1
    item.id = String(username) + "_signins"
    list.appendChild(item)
}

function CreateAttempsItems(username, list) {
    for (var i = 0; i < 10; i++) {
        var item = document.createElement('li')
        item.innerHTML = 0
        item.id = String(username) + "_" + String(i) + "_attemps"
        list.appendChild(item)
    }
}

function CreateAccuracyItems(username, list) {
    for (var i = 0; i < 10; i++) {
        var item = document.createElement('li')
        item.innerHTML = 0
        item.id = String(username) + "_" + String(i) + "_accuracy"
        list.appendChild(item)
    }
}

function UpdateAttempsAndAccuracy() {
    ID = String(username) + "_" + String(digitToShow) + "_attemps"
    listItem = document.getElementById(ID);
    var attemps = parseInt(listItem.innerHTML) + 1
    listItem.innerHTML = attemps

    ID = String(username) + "_" + String(digitToShow) + "_accuracy"
    listItem = document.getElementById(ID);
    if (meanAccuracy <= 0.5) {
        var acc = (parseFloat(listItem.innerHTML) * (attemps - 1)) / attemps
    }
    else {
        var acc = ((parseFloat(listItem.innerHTML) * (attemps - 1))  + 1)/ attemps
    }
    
    listItem.innerHTML = acc
}

function getNumberOfAttemps() {
    ID = String(username) + "_" + String(digitToShow) + "_attemps"
    listItem = document.getElementById(ID);
    return parseInt(listItem.innerHTML)
}

function getNumberOfAccuracys() {
    ID = String(username) + "_" + String(digitToShow) + "_accuracy"
    listItem = document.getElementById(ID);
    return parseFloat(listItem.innerHTML)
}

function updateScores() {

    var userScore = 0
    for (var i = 0; i < 10; i++) {
        ID = String(username) + "_" + String(i) + "_accuracy"
        listItem = document.getElementById(ID);
        userScore = userScore + parseFloat(listItem.innerHTML);
    }

    highScoreList[username] = userScore;
    //scores.push({ username: userScore })
    //listItemScore.innerHTML = scores

    var scorelist = document.getElementById('highScores');
    scorelist.innerHTML = ""

    var tuples = [];

    for (var key in highScoreList) tuples.push([key, highScoreList[key]]);

    tuples.sort(function (a, b) {
        a = a[1];
        b = b[1];

        return a < b ? 1 : (a > b ? -1 : 0);
    });

    for (var i = 0; i < tuples.length; i++) {
        var key = tuples[i][0];
        var value = tuples[i][1];

        var item = document.createElement('li');
        item.id = String(i)
        item.innerHTML = String(key);
        scorelist.appendChild(item)
    }
}
