// Selectors
const topTracksRow = document.getElementById("main_top_tracks_row");
const topTracksBtn = document.getElementById("top_tracks_button")
const topTracksTable = document.getElementById("top_tracks_table");
const recentTracksTable = document.getElementById("recent_tracks_table");

const trackContainer = document.getElementById("picked_tracks");

const searchRow = document.getElementById("main_search_row");
const searchForm = document.getElementById("search_track_form");
const searchResultsCol = document.getElementById("main_search_results_col");

const resultsTable = document.getElementById("main_results_table");
const resultsTableBody = document.getElementById("main_results_tbody");

const seeTracksBtn = document.getElementById("main_see_fav_tracks_btn");
const backToSearch = document.getElementById("main_back_to_search_btn");

const trackContainerRow = document.getElementById("picked_tracks_row");
const nextBtn = document.getElementById("next_btn_main");
const header = document.getElementById("time_header");

const access_token = document.getElementById("access_token").innerHTML;

topTracksBtn.addEventListener("click", getTopTracks);

seeTracksBtn.addEventListener("click", () => {
  searchRow.style.display = "none";
  searchResultsCol.style.display = "none";
  topTracksRow.style.display = "initial";
});

backToSearch.addEventListener("click", () => {
  searchRow.style.display = "flex";
  topTracksRow.style.display = "none";
  
  if(count > 0){
    searchRow.classList.remove("h-75");
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let query = e.target[0].value;
  let options = {
    url: "https://api.spotify.com/v1/search?q=" + query + "&type=track,artist,album&market=US&limit=20&offset=0",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    json: true,
  };

  res = fetch(options.url, {headers: options.headers})
    .then((res) => res.json())
    .then((res) => fillResultsTable(res))
    .catch(err => {console.log(err)})
  
});

function fillResultsTable(res){
  searchResultsCol.style.display = "initial";
  searchRow.classList.remove("h-75");
  
  while(resultsTableBody.firstChild){
    resultsTableBody.removeChild(resultsTableBody.firstChild);
  }

  res.tracks.items.forEach(track => {
    let row = document.createElement("tr");

    let title = document.createElement("td");
    setAttributes(title, {"class": "trackTitle", "data-track-id": track.id, "onclick": "addTrackForAnalysis(this)"});
    title.textContent = track.name;

    let artist = document.createElement("td");
    let artists = [];
    track.artists.forEach((a) => {
      artists.push(a.name);
    });
    artist.textContent = artists.join(', ');

    let album = document.createElement("td");
    album.textContent = track.album.name;

    row.appendChild(title);
    row.appendChild(artist);
    row.appendChild(album);
    
    resultsTableBody.appendChild(row);
  });
}
  
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
let limit = 5;
let count = 0;
let trackIds = [];
let trackTitles = [];

function addTrackForAnalysis(trackTitle) {
  nextBtn.style.display = "initial";
  trackContainerRow.style.display = "initial";
  if (count < limit && !trackTitle.classList.contains("chosenTrack")) {
    let btn = document.createElement("button");
    let title = trackTitle.innerHTML;
    let trackId = trackTitle.getAttribute("data-track-id");

    trackTitle.classList.toggle("chosenTrack");

    btn.innerHTML = title + " <i class='fas fa-times'></i>";
    btn.classList = "btn btn-sm btn-outline-white font-weight-bold chosenTrackBtn animated fadeInDownBig";
    
    btn.addEventListener("click", function () {
      trackContainer.removeChild(btn);
      trackIds.pop(trackId);
      trackTitles.pop(title);
      trackTitle.classList.toggle("chosenTrack");
      count--;
      if (count === 0) {
        nextBtn.style.display = "none";
        trackContainerRow.style.display = "none";
        searchRow.classList.add("h-75");
      }
    });

    trackIds.push(trackId);
    trackTitles.push(title);
    trackContainer.appendChild(btn);

    if(count === 0){
      let view = document.getElementById("main_footer");
      view.scrollIntoView({behavior: "smooth"});
    }
      
    count++;

    if (count > 0) {
      nextBtn.classList.remove("disabled");
    }
  }else if(count >= limit){
    indicateTrackLimitReached();
  }
}

function indicateTrackLimitReached(){
  let btns = document.getElementsByClassName("chosenTrackBtn");
  btns.forEach(btn => {
    btn.classList.remove("fadeInDownBig");
    btn.classList.add("pulse");
  });
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
