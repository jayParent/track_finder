const audioFeaturesObjectList = {"acousticness": audioFeaturesAvg.a, "danceability": audioFeaturesAvg.d, "energy": audioFeaturesAvg.e,
                                "instrumentalness": audioFeaturesAvg.ins, "valence": audioFeaturesAvg.v, "tempo": audioFeaturesAvg.t};

for (const [key, value] of Object.entries(audioFeaturesObjectList)) {
    createPieChart(key, value);
    setAverageFeatureValue(key, value);
  }

function createPieChart(feature, featureValue){
    let ctxP = document.getElementById(feature + "_pieChart").getContext("2d");
    if(feature === "tempo"){
        let myPieChart = new Chart(ctxP, {
            type: "pie",
            data: {
              labels: ["Average " + feature],
              datasets: [
                {
                  data: [featureValue, 200 - featureValue],
                  backgroundColor: ["#BB86FC", "#424242"],
                  hoverBackgroundColor: ["#FF5A5E", "#424242"],
                },
              ],
            },
            options: {
              responsive: true,
              animation: {
                  duration: 4000
              }
            },
          });
    }else{
        let myPieChart = new Chart(ctxP, {
            type: "pie",
            data: {
              labels: ["Average " + feature],
              datasets: [
                {
                  data: [featureValue, 1 - featureValue],
                  backgroundColor: ["#BB86FC", "#424242"],
                  hoverBackgroundColor: ["#FF5A5E", "#424242"],
                },
              ],
            },
            options: {
              responsive: true,
              animation: {
                  duration: 4000
              }
            },
          });
    } 
}

function setAverageFeatureValue(feature, featureValue){
    const avgFeature = document.getElementById("pie_chart_avg_" + feature);
    if(feature != "tempo")
      avgFeature.textContent = Math.floor(featureValue * 100) + "%";
    else
      avgFeature.textContent = featureValue.toPrecision(3);
}

// Audio features Line Chart
var ctxL_audio = document
  .getElementById("audio_features_linechart")
  .getContext("2d");
var myLineChart = new Chart(ctxL_audio, {
  type: "line",
  data: {
    labels: [
      "Acousticness",
      "Danceability",
      "Energy",
      "Instrumentalness",
      "Valence",
    ],
    datasets: [
      {
        label: "Average",
        data: [
          avg_acousticness,
          avg_danceability,
          avg_energy,
          avg_instrumentalness,
          avg_valence,
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
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 1,
            fontColor: "white",
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontColor: "white",
            autoSkip: false,
          },
        },
      ],
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    legend: {
      labels: {
        fontColor: "white",
      },
    },
    animation: {
        duration: 4000
    }
  },
});
