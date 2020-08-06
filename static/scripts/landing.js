const moreInfoArrow = document.getElementById("index_more_info_arrow");
const moreInfoView = document.getElementById("more_info_container");
const getStartedArrow = document.getElementById("index_get_started_arrow");
const topOfWindowView = document.getElementById("index_top_page");

moreInfoArrow.addEventListener("click", () => {
    moreInfoView.scrollIntoView({behavior: "smooth"});
});

getStartedArrow.addEventListener("click", () => {
    topOfWindowView.scrollIntoView({behavior: "smooth"});
});

