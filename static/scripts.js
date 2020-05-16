// Add or remove tracks from list to analyse
let trackContainer = document.getElementById("picked_tracks");
let limit = 5,
  count = 0;
let trackIds = [];
let trackTitles = [];

function addTrackForAnalysis(trackTitle) {
  if (count < limit) {
    let btn = document.createElement("button");
    let title = trackTitle.innerHTML;
    btn.innerHTML =  title + " <i class='fas fa-times'></i>";
    btn.classList = "btn btn-sm btn-outline-light-green";
    let trackId = trackTitle.getAttribute("data-track-id");
    btn.addEventListener("click", function () {
      trackContainer.removeChild(btn);
      trackIds.pop(trackId);
      trackTitles.pop(title);
      count--;
    });
    trackIds.push(trackId);
    trackTitles.push(title);
    trackContainer.appendChild(btn);
    count++;
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

  trackTitles.forEach(function(trackTitle){
      titleString += trackTitle;
  })

  idString = idString.slice(0, -1);
  nextBtn.href = nextBtn.href + idString;
});

