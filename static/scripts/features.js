const seeDetailsBtn = document.getElementById("features_see_details_btn");

seeDetailsBtn.addEventListener("click", () => {
    let view = document.getElementById("see_details_view");
    view.scrollIntoView({behavior: "smooth"});
});

document.getElementById("back_btn").addEventListener("click", goBack);
function goBack() {
    window.history.back();
}

// Calculate average audio features for picked tracks
function calcAvgAudioFeatures() {
    let acousticnessObj = document.getElementsByClassName("acousticness");
    let danceabilityObj = document.getElementsByClassName("danceability");
    let energyObj = document.getElementsByClassName("energy");
    let instrumentalnessObj = document.getElementsByClassName("instrumentalness");
    let valenceObj = document.getElementsByClassName("valence");
    let tempoObj = document.getElementsByClassName("tempo");

    let audioFeaturesAvg = { a: 0, d: 0, e: 0, ins: 0, v: 0, t: 0 };

    for (var i = 0; i < acousticnessObj.length; i++) {
        var value = parseFloat(acousticnessObj[i].textContent);
        audioFeaturesAvg.a += value;
        value = parseFloat(danceabilityObj[i].textContent);
        audioFeaturesAvg.d += value;
        value = parseFloat(energyObj[i].textContent);
        audioFeaturesAvg.e += value;
        value = parseFloat(instrumentalnessObj[i].textContent);
        audioFeaturesAvg.ins += value;
        value = parseFloat(valenceObj[i].textContent);
        audioFeaturesAvg.v += value;
        value = parseFloat(tempoObj[i].textContent);
        audioFeaturesAvg.t += value;
    }
    audioFeaturesAvg.a /= acousticnessObj.length;
    audioFeaturesAvg.d /= danceabilityObj.length;
    audioFeaturesAvg.e /= energyObj.length;
    audioFeaturesAvg.ins /= instrumentalnessObj.length;
    audioFeaturesAvg.v /= valenceObj.length;
    audioFeaturesAvg.t /= tempoObj.length;

    return audioFeaturesAvg;
};

let audioFeaturesAvg = calcAvgAudioFeatures();
document.getElementById("avg_acousticness").textContent = audioFeaturesAvg.a.toPrecision(3);
document.getElementById("avg_danceability").textContent = audioFeaturesAvg.d.toPrecision(3);
document.getElementById("avg_energy").textContent = audioFeaturesAvg.e.toPrecision(3);
document.getElementById("avg_instrumentalness").textContent = audioFeaturesAvg.ins.toPrecision(3);
document.getElementById("avg_valence").textContent = audioFeaturesAvg.v.toPrecision(3);
document.getElementById("avg_tempo").textContent = audioFeaturesAvg.t.toPrecision(3);

let avg_acousticness = parseFloat(document.getElementById("avg_acousticness").textContent);
let avg_danceability = parseFloat(document.getElementById("avg_danceability").textContent);
let avg_energy = parseFloat(document.getElementById("avg_energy").textContent);
let avg_instrumentalness = parseFloat(document.getElementById("avg_instrumentalness").textContent);
let avg_valence = parseFloat(document.getElementById("avg_valence").textContent);
let avg_tempo = parseFloat(document.getElementById("avg_tempo").textContent);

window.onload = function () {
    let trackItems = document.getElementsByClassName("trackItem");
    for (var i = 0; i < trackItems.length; i++) {
        let borderColors = ["rgb(106, 38, 111)", "rgb(66, 114, 19)", "rgb(124, 67, 19)", "rgb(38, 89, 106)", "rgb(124, 19, 19)"];

        let title = document.getElementById("title" + i).textContent;
        let a = document.getElementById("a" + i).textContent;
        let d = document.getElementById("d" + i).textContent;
        let e = document.getElementById("e" + i).textContent;
        let ins = document.getElementById("ins" + i).textContent;
        let v = document.getElementById("v" + i).textContent;

        myLineChart.data.datasets.push({
            label: title,
            borderColor: borderColors[i],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderWidth: 3,
            data: [a, d, e, ins, v]
        });
        myLineChart.update();
    }
}

// Sliders
let checkBtns = document.getElementsByTagName("input");
let sliderContainer = document.getElementById("slider_container");
let featureData = new Object();

function createSliders(e) {
    let id = e.target.id;
    let targetSlider, maxSlider, targetNumDisplay, maxNumDisplay, sliders;

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
        setAttributes(colOne, { "class": "col-10 col-lg-4 mx-auto" });
        colTwo = document.createElement("div");
        setAttributes(colTwo, { "class": "col-10 col-lg-4 mx-auto" });

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