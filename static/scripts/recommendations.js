const recomendationsBackTopBtn = document.getElementById("recommendations_back_top_btn");

recomendationsBackTopBtn.addEventListener("click", () => {
    let view = document.getElementById("recommendations_top_page");
    view.scrollIntoView({behavior: "smooth"});
});