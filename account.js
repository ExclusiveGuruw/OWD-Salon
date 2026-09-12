const logoutButton = document.getElementById("logoutButton");
const adminBookingLink = document.getElementById("adminBookingLink");
const currentUser = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");

if (currentUser && logoutButton) {
    logoutButton.classList.remove("hidden");
}

if (adminBookingLink) {
    if (currentUser && currentUser.role === "admin") {
        adminBookingLink.classList.remove("hidden");
    } else {
        adminBookingLink.classList.add("hidden");
    }
}

if (logoutButton) {
    logoutButton.addEventListener("click", function(){
        sessionStorage.removeItem("blushCurrentUser");
        window.location.href = "index.html";
    });
}
