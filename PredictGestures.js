// JavaScript source code
//console.log(train0)

//Global variables
var trainingCompleted = false;
var testingSampleIndex = 0;
//var numSamples = train1.shape[3];

//var predictedClassLabels = nj.zeros(numSamples)

// classifier
const knnClassifier = ml5.KNNClassifier();

function draw() {
    clear();


    // Train if not 
    if (trainingCompleted == false) {
        Train();
    }
    
    Test();

}

function Train() {
    //console.log(train0)

    for (var i = 0; i < train0.shape[3]; i++) {
        var features = train0.pick(null, null, null, i).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 0);

        features = train1.pick(null, null, null, i).reshape(1, 120);
        knnClassifier.addExample(features.tolist(), 1);

    }

    trainingCompleted = true;
}

function Test() {
    //console.log(test)
    
    var currentTestingSample = test.pick(null, null, null, testingSampleIndex).reshape(1, 120);
    knnClassifier.classify(currentTestingSample.tolist(), GotResults);

    
}

function GotResults(err, result) {
    console.log(testingSampleIndex, parseInt(result.label));

   // predictedClassLabels.set(testingSampleIndex, parseInt(result.label));

    testingSampleIndex ++;

    if (testingSampleIndex == numSamples) {
        testingSampleIndex = 0;
    }
}