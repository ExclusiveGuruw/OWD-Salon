const logoutButton = document.getElementById("logoutButton");
const bookingNavigatorButton = document.getElementById("bookingNavigatorButton");
const currentUser = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");

if (currentUser && logoutButton) {
    logoutButton.classList.remove("hidden");
}

if (bookingNavigatorButton) {
    if (currentUser && currentUser.role === "admin") {
        bookingNavigatorButton.classList.remove("hidden");
    } else {
        bookingNavigatorButton.classList.add("hidden");
    }

    bookingNavigatorButton.addEventListener("click", function(){
        if (currentUser && currentUser.role === "admin") {
            window.location.href = "index.html#adminSection";
            return;
        }

        window.location.href = "index.html";
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", function(){
        sessionStorage.removeItem("blushCurrentUser");
        window.location.href = "index.html";
    });
}
