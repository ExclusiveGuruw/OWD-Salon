const currentUser = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");

function getBookings(){
    return JSON.parse(localStorage.getItem("blushBookings") || "[]");
}

function money(amount){
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(amount);
}

function renderAdminOverview(){
    const user = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");

    if(!user || user.role !== "admin"){
        window.location.href = "index.html";
        return;
    }

    const bookings = getBookings();
    const pendingCount = bookings.filter((booking) => booking.status === "Pending").length;
    const confirmedCount = bookings.filter((booking) => booking.status === "Confirmed").length;
    const completedCount = bookings.filter((booking) => booking.status === "Completed").length;

    document.getElementById("adminOverview").innerHTML = `
        <div class="admin-card">
            <p class="small-title">ADMIN ACCOUNT</p>
            <h3>Welcome, ${user.name}</h3>
            <p>${user.email}</p>
        </div>
        <div class="admin-card">
            <h3>${bookings.length}</h3>
            <p>Total bookings</p>
        </div>
        <div class="admin-card">
            <h3>${pendingCount}</h3>
            <p>Pending</p>
        </div>
        <div class="admin-card">
            <h3>${confirmedCount}</h3>
            <p>Confirmed</p>
        </div>
        <div class="admin-card">
            <h3>${completedCount}</h3>
            <p>Completed</p>
        </div>
    `;
}

function renderAdminBookings(){
    const user = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");

    if(!user || user.role !== "admin"){
        window.location.href = "index.html";
        return;
    }

    const bookings = getBookings();
    const container = document.getElementById("adminBookings");

    if(bookings.length === 0){
        container.innerHTML = `
            <div class="admin-card">
                <p>No customer bookings yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map((booking) => `
        <div class="admin-booking">
            <div class="admin-booking-info">
                <strong>${booking.customer}</strong>
                <small>${booking.service}</small>
                <small>${booking.date} at ${booking.time}</small>
                <small>${booking.email} • ${money(booking.price)}</small>
            </div>
            <div class="admin-actions">
                <select onchange="changeBookingStatus(${booking.id}, this.value)">
                    <option ${booking.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${booking.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                    <option ${booking.status === "Completed" ? "selected" : ""}>Completed</option>
                    <option ${booking.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                </select>
                <button class="delete-button" onclick="deleteBooking(${booking.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

function saveBookings(bookings){
    localStorage.setItem("blushBookings", JSON.stringify(bookings));
}

function changeBookingStatus(id, newStatus){
    const bookings = getBookings();
    const updated = bookings.map((booking) => {
        if(booking.id === id){
            booking.status = newStatus;
        }
        return booking;
    });

    saveBookings(updated);
    renderAdminOverview();
    renderAdminBookings();
}

function deleteBooking(id){
    const confirmDelete = confirm("Are you sure you want to delete this booking?");

    if(!confirmDelete){
        return;
    }

    const bookings = getBookings().filter((booking) => booking.id !== id);
    saveBookings(bookings);
    renderAdminOverview();
    renderAdminBookings();
}

function setupLogout(){
    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.classList.remove("hidden");

    logoutButton.addEventListener("click", function(){
        sessionStorage.removeItem("blushCurrentUser");
        window.location.href = "index.html";
    });
}

if(!currentUser || currentUser.role !== "admin"){
    window.location.href = "index.html";
}else{
    setupLogout();
    renderAdminOverview();
    renderAdminBookings();
}
