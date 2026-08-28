const logoutButton = document.getElementById("logoutButton");
const currentUser = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");

if (currentUser && logoutButton) {
    logoutButton.classList.remove("hidden");
}

if (logoutButton) {
    logoutButton.addEventListener("click", function(){
        sessionStorage.removeItem("blushCurrentUser");
        window.location.href = "index.html";
    });
}
