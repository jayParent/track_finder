const seeDetailsBtn = document.getElementById("features_see_details_btn");
const easyModeBtn = document.getElementById("features_easy_mode_btn");

seeDetailsBtn.addEventListener("click", () => {
    let view = document.getElementById("see_details_view");
    view.scrollIntoView({behavior: "smooth"});
});