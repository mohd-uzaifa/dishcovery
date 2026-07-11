// Smooth scroll
document.querySelector(".cta-btn").addEventListener("click", () => {
    document.querySelector("#features").scrollIntoView({
        behavior: "smooth"
    });
});

const loadingOverlay = document.getElementById("loadingOverlay");

// Check cache first
const cachedRecipes = sessionStorage.getItem("recipes");

if (cachedRecipes) {

    console.log("Recipes loaded from cache");

    loadingOverlay.style.display = "none";

} else {

    loadingOverlay.style.display = "flex";

    fetch("https://dishcovery-backend-tprd.onrender.com/api/recipes")
        .then(res => res.json())
        .then(data => {

            sessionStorage.setItem("recipes", JSON.stringify(data));

            console.log("Recipes downloaded and cached.");

            loadingOverlay.style.display = "none";

        })
        .catch(err => {

            console.error(err);

            loadingOverlay.style.display = "none";

            alert("Unable to load recipes. Please refresh.");

        });
}