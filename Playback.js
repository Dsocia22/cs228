// JavaScript source code
oneFrameOfData = nj.array([[[78.77817, 482.71766, 188.677, 78.77817, 482.71766, 188.677],
                            [78.77817, 482.71766, 188.677, 100.7532, 528.70163, 143.805],
                            [100.7532, 528.70163, 143.805, 105.23872, 631.68747, 111.807],
                            [105.23872, 631.68747, 111.807, 113.91846, 665.40508, 90.2868]],
                            [[61.48503, 320.57986, 183.989, 71.51915, 154.68684, 113.396],
                            [71.51915, 154.68684, 113.396, 72.36063, 169.4996, 70.7031],
                            [72.36063, 169.4996, 70.7031, 80.34046, 334.65941, 55.1041],
                            [80.34046, 334.65941, 55.1041, 87.69235, 487.63213, 53.5961]],
                            [[49.21066, 348.53089, 181.161, 49.56268, 228.35432, 112.845],
                            [49.56268, 228.35432, 112.845, 48.48719, 234.2497, 64.9235],
                            [48.48719, 234.2497, 64.9235, 59.84905, 398.72584, 44.6894],
                            [59.84905, 398.72584, 44.6894, 70.69177, 549.01344, 40.8627]],
                            [[37.96119, 405.54268, 179.259, 29.31123, 338.47407, 117.872],
                            [29.31123, 338.47407, 117.872, 22.39014, 300.65446, 74.0852],
                            [22.39014, 300.65446, 74.0852, 29.7976, 409.47624, 49.8045],
                            [29.7976, 409.47624, 49.8045, 39.77139, 534.14123, 39.8803]],
                            [[30.14953, 525.13467, 178.651, 13.53744, 479.35878, 123.345],
                            [13.53744, 479.35878, 123.345, 1.4658, 492.08091, 90.0989],
                            [1.4658, 492.08091, 90.0989, 4.85992, 571.7924, 72.6806],
                            [4.85992, 571.7924, 72.6806, 14.22231, 674.54044, 62.2718]]])

anotherFrameOfData = nj.array([[[76.00247, 657.80491, 137.576, 76.00247, 657.80491, 137.576],
                                [76.00247, 657.80491, 137.576, 111.59207, 604.4771, 101.036],
                                [111.59207, 604.4771, 101.036, 131.0129, 604.78413, 72.3025],
                                [131.0129, 604.78413, 72.3025, 135.29738, 658.84245, 49.8244]],
                                [[60.68127, 463.29657, 133.742, 77.39423, 219.35653, 65.682],
                                [77.39423, 219.35653, 65.682, 75.86555, 72.45891, 25.0475],
                                [75.86555, 72.45891, 25.0475, 82.51094, 220.26703, 6.34236],
                                [82.51094, 220.26703, 6.34236, 88.42143, 390.83767, 5.27822]],
                                [[48.37552, 477.90693, 129.939, 54.82557, 275.60641, 63.1159],
                                [54.82557, 275.60641, 63.1159, 49.81162, 88.21268, 18.5341],
                                [49.81162, 88.21268, 18.5341, 59.48516, 213.86176, -5.63638],
                                [59.48516, 213.86176, -5.63638, 69.13594, 381.29859, -10.0898]],
                                [[36.74127, 525.44353, 126.795, 33.19896, 378.40828, 65.8062],
                                [33.19896, 378.40828, 65.8062, 25.44413, 187.83839, 25.5749],
                                [25.44413, 187.83839, 25.5749, 33.58455, 267.46484, 0.04729],
                                [33.58455, 267.46484, 0.04729, 43.89455, 410.80516, -8.36908]],
                                [[27.83064, 644.32738, 124.439, 15.70393, 518.80535, 68.8483],
                                [15.70393, 518.80535, 68.8483, 1.22701, 430.03154, 37.3399],
                                [1.22701, 430.03154, 37.3399, 4.90042, 495.61934, 19.1156],
                                [4.90042, 495.61934, 19.1156, 15.4976, 612.66102, 10.4786]]])

var frameIndex = 0;
var flip = 0;

function draw() {
    clear();
    console.log(flip)
    for (var fingerIndex = 0; fingerIndex < 5; fingerIndex++) {
        for (var boneIndex = 0; boneIndex < 4; boneIndex++) {
            if (flip == 0) {
                var xStart = oneFrameOfData.get(fingerIndex, boneIndex, 0)
                var yStart = oneFrameOfData.get(fingerIndex, boneIndex, 1)
                var zStart = oneFrameOfData.get(fingerIndex, boneIndex, 2)
                var xEnd = oneFrameOfData.get(fingerIndex, boneIndex, 3)
                var yEnd = oneFrameOfData.get(fingerIndex, boneIndex, 4)
                var zEnd = oneFrameOfData.get(fingerIndex, boneIndex, 5)

                line(xStart, yStart, xEnd, yEnd)
            }
            else {
                var xStart = anotherFrameOfData.get(fingerIndex, boneIndex, 0)
                var yStart = anotherFrameOfData.get(fingerIndex, boneIndex, 1)
                var zStart = anotherFrameOfData.get(fingerIndex, boneIndex, 2)
                var xEnd = anotherFrameOfData.get(fingerIndex, boneIndex, 3)
                var yEnd = anotherFrameOfData.get(fingerIndex, boneIndex, 4)
                var zEnd = anotherFrameOfData.get(fingerIndex, boneIndex, 5)

                xStart = window.innerWidth * xStart;
                xEnd = window.innerWidth * xEnd;
                yStart = window.innerHeight * (1 - yStart);
                yEnd = window.innerHeight * (1 - yEnd);


                line(xStart, yStart, xEnd, yEnd)
            }
        }
    }

    frameIndex++;
    if (frameIndex == 100) {
        frameIndex = 0;
        flip = ~flip + 2
    }
}
