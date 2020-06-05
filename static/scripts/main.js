// Selectors
let topTracksBtn = document.getElementById("top_tracks_button"),
  topTracksTable = document.getElementById("top_tracks_table"),
  recentTracksTable = document.getElementById("recent_tracks_table"),
  trackContainer = document.getElementById("picked_tracks"),
  nextBtn = document.getElementById("next_btn_main"),
  header = document.getElementById("time_header");

  topTracksBtn.addEventListener("click", getTopTracks);
  
// Fill content with top tracks when button is pressed
function getTopTracks() {
  if (topTracksBtn.textContent === "See All-Time Top Tracks") {
    topTracksBtn.textContent = "See Recent Top Tracks";
    topTracksTable.style.display = "table";
    recentTracksTable.style.display = "none";
    header.textContent = "Your 50 most-played Tracks, All-Time";
  } else {
    topTracksTable.style.display = "none";
    recentTracksTable.style.display = "table";
    topTracksBtn.textContent = "See All-Time Top Tracks";
    header.textContent = "Your 50 most-played Tracks, Recently";
  }
}

// Add or remove tracks from list to analyse
let limit = 5,
  count = 0,
  trackIds = [],
  trackTitles = [];

function addTrackForAnalysis(trackTitle) {
  nextBtn.style.display = "initial";
  if (count < limit) {
    let btn = document.createElement("button"),
      title = trackTitle.innerHTML,
      trackId = trackTitle.getAttribute("data-track-id");

    btn.innerHTML = title + " <i class='fas fa-times'></i>";
    btn.classList = "btn btn-sm btn-outline-white font-weight-bold";
    
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
nextBtn.addEventListener("click", function () {
  let idString = "",
    titleString = "";

  trackIds.forEach(function (trackId) {
    idString = idString + trackId + ",";
  });

  trackTitles.forEach(function (trackTitle) {
    titleString += trackTitle;
  });

  idString = idString.slice(0, -1);
  nextBtn.href = nextBtn.href + idString;
});
