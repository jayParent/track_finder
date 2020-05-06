    // Add or remove tracks from list to analyse
    let trackTitle = document.getElementsByClassName("trackTitle");
    let trackContainer = document.getElementById("picked_tracks");
    let limit = 5, count = 0;

    function addTrackForAnalysis(trackTitle) {
        if(count < limit){
            let btn = document.createElement("button");
            btn.innerHTML = trackTitle.innerHTML + " <i class='fas fa-times'></i>";
            btn.classList = "btn btn-sm btn-outline-unique"
            btn.addEventListener("click", function(){
                trackContainer.removeChild(btn);
            });
            trackContainer.appendChild(btn);
            count++; 
        }   
    }