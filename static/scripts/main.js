// Begin
let beginBtn = document.getElementById("begin_btn"),
    pickTracksBtns = document.getElementsByClassName("pick_tracks_btns"),
    welcomeElements = document.getElementsByClassName("main_welcome");
beginBtn.addEventListener("click", function(){
    welcomeElements[0].style.display = "none";
    welcomeElements[1].style.display = "none";
    pickTracksBtns[0].style.display = "initial";
    document.getElementById("next_btn_container").classList.add("mt-5");
    getTopTracks();
})

// Fill content with top tracks when button is pressed
let topTracksBtn = document.getElementById("top_tracks_button");
topTracksBtn.addEventListener("click", getTopTracks);

let topTracksTable = document.getElementById("top_tracks_table");
let recentTracksTable = document.getElementById("recent_tracks_table");

function getTopTracks() {
    if (topTracksBtn.textContent == "See All-Time Top Tracks") {
        topTracksBtn.textContent = "See Recent Top Tracks";
        topTracksTable.style.display = "table";
        recentTracksTable.style.display = "none";
    } else {
        topTracksTable.style.display = "none";
        recentTracksTable.style.display = "table";
        topTracksBtn.textContent = "See All-Time Top Tracks";
    }
}

// Add or remove tracks from list to analyse
let trackContainer = document.getElementById("picked_tracks");
let limit = 5,
    count = 0;
let trackIds = [];
let trackTitles = [];

function addTrackForAnalysis(trackTitle) {
    nextBtn.style.display = "initial";
    if (count < limit) {
        let btn = document.createElement("button");
        let title = trackTitle.innerHTML;
        btn.innerHTML = title + " <i class='fas fa-times'></i>";
        btn.classList = "btn btn-sm btn-white font-weight-bold";
        let trackId = trackTitle.getAttribute("data-track-id");
        btn.addEventListener("click", function () {
            trackContainer.removeChild(btn);
            trackIds.pop(trackId);
            trackTitles.pop(title);
            count--;
            if (count === 0) {
                nextBtn.classList.add("disabled");
            }
        });
        trackIds.push(trackId);
        trackTitles.push(title);
        trackContainer.appendChild(btn);
        count++;

        if (count > 0) {
            nextBtn.classList.remove("disabled");
        }
    }

}

// Send tracks for analysis
let nextBtn = document.getElementById("next_btn");

nextBtn.addEventListener("click", function () {
    let idString = "";
    let titleString = "";

    trackIds.forEach(function (trackId) {
        idString = idString + trackId + ",";
    });

    trackTitles.forEach(function (trackTitle) {
        titleString += trackTitle;
    })

    idString = idString.slice(0, -1);
    nextBtn.href = nextBtn.href + idString;
});