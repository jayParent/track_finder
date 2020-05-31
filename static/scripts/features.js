// Set multiple attributes at once on hmtl element
function setAttributes(element, attributes) {
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Calculate average audio features for picked tracks
function calcAvgAudioFeatures() {
    let acousticnessObj = document.getElementsByClassName("acousticness"),
        danceabilityObj = document.getElementsByClassName("danceability"),
        energyObj = document.getElementsByClassName("energy"),
        instrumentalnessObj = document.getElementsByClassName("instrumentalness"),
        livenessObj = document.getElementsByClassName("liveness"),
        loudnessObj = document.getElementsByClassName("loudness"),
        speechinessObj = document.getElementsByClassName("speechiness"),
        valenceObj = document.getElementsByClassName("valence"),
        tempoObj = document.getElementsByClassName("tempo");

    let audioFeaturesAvg = { a: 0, d: 0, e: 0, ins: 0, li: 0, lo: 0, s: 0, v: 0, t: 0 }

    for (var i = 0; i < acousticnessObj.length; i++) {
        var value = parseFloat(acousticnessObj[i].textContent);
        audioFeaturesAvg.a += value;
        value = parseFloat(danceabilityObj[i].textContent);
        audioFeaturesAvg.d += value;
        value = parseFloat(energyObj[i].textContent);
        audioFeaturesAvg.e += value;
        value = parseFloat(instrumentalnessObj[i].textContent);
        audioFeaturesAvg.ins += value;
        value = parseFloat(livenessObj[i].textContent);
        audioFeaturesAvg.li += value;
        value = parseFloat(loudnessObj[i].textContent);
        audioFeaturesAvg.lo += value;
        value = parseFloat(speechinessObj[i].textContent);
        audioFeaturesAvg.s += value;
        value = parseFloat(valenceObj[i].textContent);
        audioFeaturesAvg.v += value;
        value = parseFloat(tempoObj[i].textContent);
        audioFeaturesAvg.t += value;
    }
    audioFeaturesAvg.a /= acousticnessObj.length;
    audioFeaturesAvg.d /= danceabilityObj.length;
    audioFeaturesAvg.e /= energyObj.length;
    audioFeaturesAvg.ins /= instrumentalnessObj.length;
    audioFeaturesAvg.li /= livenessObj.length;
    audioFeaturesAvg.lo /= loudnessObj.length;
    audioFeaturesAvg.s /= speechinessObj.length;
    audioFeaturesAvg.v /= valenceObj.length;
    audioFeaturesAvg.t /= tempoObj.length;

    return audioFeaturesAvg;
};

let audioFeaturesAvg = calcAvgAudioFeatures();
document.getElementById("avg_acousticness").textContent = audioFeaturesAvg.a.toPrecision(3);
document.getElementById("avg_danceability").textContent = audioFeaturesAvg.d.toPrecision(3);
document.getElementById("avg_energy").textContent = audioFeaturesAvg.e.toPrecision(3);
document.getElementById("avg_instrumentalness").textContent = audioFeaturesAvg.ins.toPrecision(3);
document.getElementById("avg_liveness").textContent = audioFeaturesAvg.li.toPrecision(3);
document.getElementById("avg_loudness").textContent = audioFeaturesAvg.lo.toPrecision(3);
document.getElementById("avg_speechiness").textContent = audioFeaturesAvg.s.toPrecision(3);
document.getElementById("avg_valence").textContent = audioFeaturesAvg.v.toPrecision(3);
document.getElementById("avg_tempo").textContent = audioFeaturesAvg.t.toPrecision(3);

let a = document.getElementById("avg_acousticness").textContent,
    d = document.getElementById("avg_danceability").textContent,
    e = document.getElementById("avg_energy").textContent,
    ins = document.getElementById("avg_instrumentalness").textContent,
    li = document.getElementById("avg_liveness").textContent,
    lo = document.getElementById("avg_loudness").textContent,
    s = document.getElementById("avg_speechiness").textContent,
    v = document.getElementById("avg_valence").textContent,
    t = document.getElementById("avg_tempo").textContent;

// Audio features Line Chart
var ctxL_audio = document.getElementById("audio_features_linechart").getContext("2d");
var myLineChart = new Chart(ctxL_audio, {
    type: "line",
    data: {
        labels: [
            "Acousticness",
            "Danceability",
            "Energy",
            "Instrumentalness",
            "Liveness",
            "Speechiness",
            "Valence",
        ],
        datasets: [
            {
                label: "Average",
                data: [
                    a,
                    d,
                    e,
                    ins,
                    li,
                    s,
                    v,
                ],
                borderColor: ["rgba(0, 0, 0)"],
                backgroundColor: "rgba(255, 255, 255, 0)",
                borderWidth: 3,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 1,
                    fontColor: "white"
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "white"
                }
            }]
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        legend: {
            labels: {
                fontColor: "white"
            }
        }
    },
});

window.onload = function () {
    let trackItems = document.getElementsByClassName("trackItem");
    for (var i = 0; i < trackItems.length; i++) {
        let borderColors = ["rgb(106, 38, 111)", "rgb(66, 114, 19)", "rgb(124, 67, 19)", "rgb(38, 89, 106)", "rgb(124, 19, 19)"];
        // trackItems[i].style.backgroundColor = borderColors[i];

        let title = document.getElementById("title" + i).textContent,
            a = document.getElementById("a" + i).textContent,
            d = document.getElementById("d" + i).textContent,
            e = document.getElementById("e" + i).textContent,
            ins = document.getElementById("ins" + i).textContent,
            li = document.getElementById("li" + i).textContent,
            s = document.getElementById("s" + i).textContent,
            v = document.getElementById("v" + i).textContent;
        myLineChart.data.datasets.push({
            label: title,
            borderColor: borderColors[i],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderWidth: 3,
            data: [a, d, e, ins, li, s, v]
        });
        myLineChart.update();
    }
}

document.getElementById("back_btn").addEventListener("click", goBack);
function goBack() {
    window.history.back();
}

// Sliders
let checkBtns = document.getElementsByTagName("input");
let sliderContainer = document.getElementById("slider_container");
let featureData = new Object();

function createSliders(e) {
    let id = e.target.id;
    let targetSlider, maxSlider, targetNumDisplay, maxNumDisplay, sliders;
    let avg_acousticness = parseFloat(document.getElementById("avg_acousticness").textContent),
        avg_danceability = parseFloat(document.getElementById("avg_danceability").textContent),
        avg_energy = parseFloat(document.getElementById("avg_energy").textContent),
        avg_instrumentalness = parseFloat(document.getElementById("avg_instrumentalness").textContent),
        avg_liveness = parseFloat(document.getElementById("avg_liveness").textContent),
        avg_loudness = parseFloat(document.getElementById("avg_loudness").textContent),
        avg_speechiness = parseFloat(document.getElementById("avg_speechiness").textContent),
        avg_valence = parseFloat(document.getElementById("avg_valence").textContent),
        avg_tempo = parseFloat(document.getElementById("avg_tempo").textContent);

    function makeSliders(value, id) {
        if (id === "Tempo") {
            targetSlider = document.createElement("input");
            setAttributes(targetSlider, {
                "type": "range", "class": "custom-range", "min": "0", "max": "255",
                "step": "1", "value": value, "id": id + "_target", "name": "target_" + id, "oninput": "updateSliderValue(this.value, this.name);"
            });
            maxSlider = document.createElement("input");
            setAttributes(maxSlider, {
                "type": "range", "class": "custom-range", "min": "0", "max": "255",
                "step": "1", "value": value, "id": id + "_max", "name": "max_" + id, "oninput": "updateSliderValue(this.value, this.name);"
            });

        } else if (id === "Loudness") {
            targetSlider = document.createElement("input");
            setAttributes(targetSlider, {
                "type": "range", "class": "custom-range", "min": "-60", "max": "0",
                "step": "1", "value": value, "id": id + "_target", "name": "target_" + id, "oninput": "updateSliderValue(this.value, this.name);"
            });
            maxSlider = document.createElement("input");
            setAttributes(maxSlider, {
                "type": "range", "class": "custom-range", "min": "-60", "max": "0",
                "step": "1", "value": value, "id": id + "_max", "name": "max_" + id, "oninput": "updateSliderValue(this.value, this.name);"
            });
        } else {
            targetSlider = document.createElement("input");
            setAttributes(targetSlider, {
                "type": "range", "class": "custom-range", "min": "0", "max": "1",
                "step": "0.01", "value": value, "id": id + "_target", "name": "target_" + id, "oninput": "updateSliderValue(this.value, this.name);"
            });
            maxSlider = document.createElement("input");
            setAttributes(maxSlider, {
                "type": "range", "class": "custom-range", "min": "0", "max": "1",
                "step": "0.01", "value": value, "id": id + "_max", "name": "max_" + id, "oninput": "updateSliderValue(this.value, this.name);"
            });
        }

        targetNumDisplay = document.createElement("p");
        setAttributes(targetNumDisplay, { "class": "feature-display", "id": "target_" + id });
        targetNumDisplay.textContent = value;

        maxNumDisplay = document.createElement("p");
        setAttributes(maxNumDisplay, { "class": "feature-display", "id": "max_" + id });
        maxNumDisplay.textContent = value;

        sliders = [targetNumDisplay, targetSlider, maxNumDisplay, maxSlider];
        return sliders;
    }

    if (e.target.type === "checkbox" && e.target.checked === true) {
        checkedBtnCount++;
        let container = document.createElement("div");
        setAttributes(container, { "class": "slider-group my-3 container-fluid", "id": id + "_container" });

        let row = document.createElement("div");
        setAttributes(row, { "class": "row" });
        colOne = document.createElement("div");
        setAttributes(colOne, { "class": "col-4 mx-auto" });
        colTwo = document.createElement("div");
        setAttributes(colTwo, { "class": "col-4 mx-auto" });

        switch (id) {
            case "Acousticness":
                sliders = makeSliders(avg_acousticness, id);
                break;

            case "Danceability":
                sliders = makeSliders(avg_danceability, id);
                break;

            case "Energy":
                sliders = makeSliders(avg_energy, id);
                break;

            case "Instrumentalness":
                sliders = makeSliders(avg_instrumentalness, id);
                break;

            case "Liveness":
                sliders = makeSliders(avg_liveness, id);
                break;

            case "Loudness":
                sliders = makeSliders(avg_loudness, id);
                break;

            case "Speechiness":
                sliders = makeSliders(avg_speechiness, id);
                break;

            case "Valence":
                sliders = makeSliders(avg_valence, id);
                break;

            case "Tempo":
                sliders = makeSliders(avg_tempo, id);
                break;
        }

        let targetLabel = document.createElement("label");
        let maxLabel = document.createElement("label");
        targetLabel.setAttribute("for", "target_" + id);
        maxLabel.setAttribute("for", "max_" + id);
        targetLabel.textContent = "Target " + id;
        maxLabel.textContent = "Max " + id;

        colOne.appendChild(targetLabel);
        colOne.appendChild(sliders[0]);
        colOne.appendChild(sliders[1]);
        row.appendChild(colOne);

        colTwo.appendChild(maxLabel);
        colTwo.appendChild(sliders[2]);
        colTwo.appendChild(sliders[3]);
        row.appendChild(colTwo);

        container.appendChild(row);

        sliderContainer.appendChild(container);
    } else {
        checkedBtnCount--;
        let removedDiv = document.getElementById(e.target.id + "_container");
        sliderContainer.removeChild(removedDiv);
    }
};

checkBtns.forEach(function (btn) {
    btn.addEventListener("click", createSliders);
});

function updateSliderValue(value, name) {
    document.getElementById(name).innerHTML = value;
}

// Send data to next page
let nextBtn = document.getElementById("next_btn");
let checkedBtnCount = 0;

function sendData() {
    if (checkedBtnCount > 0) {
        let access_token = '<%= access_token %>';
        let trackIds = '<%= trackIds %>';
        let queryString = "limit=40&seed_tracks=";

        trackIds += "&";
        queryString += trackIds;

        // Audio Feature values
        let featureDisplays = document.getElementsByClassName("feature-display");
        let featureData = new Object();
        for (var i = 0; i < featureDisplays.length; i++) {
            let key = featureDisplays[i].id;
            let value = parseFloat(featureDisplays[i].textContent);
            featureData[key] = value;
        }

        const entries = Object.entries(featureData);
        for (const [key, value] of entries) {
            queryString = queryString + key + "=" + value + "&";
        }
        queryString = queryString.slice(0, -1);

        // Desired Audio features
        let featuresList = "",
            checkBoxes = document.getElementsByTagName("input");

        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].type === "checkbox" && checkBoxes[i].checked === true) {
                featuresList = featuresList + checkBoxes[i].id + ", ";
            }
        }
        featuresList = featuresList.slice(0, -2);

        let url = "/recommendations/" + access_token + "/" + queryString + "/" + featuresList + "/" + trackIds;
        nextBtn.href = url;
    }else{
        let instructions = document.getElementById("checkbox_instructions");
        let alert = document.createElement("h6");
        alert.textContent = "Please select at least 1 audio feature.";
        alert.setAttribute("class", "text-danger");

        instructions.appendChild(alert);
    }

}

nextBtn.addEventListener("click", sendData);