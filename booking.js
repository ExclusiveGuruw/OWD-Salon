const bookingDate = document.getElementById("bookingDate");
const prices = {
    "Haircut & Blow-Dry": 650,
    "Hair Color": 1800,
    "Balayage": 3200,
    "Hair Treatment": 950,
    "Gel Manicure": 700,
    "Gel Pedicure": 850,
    "Brow Shaping": 350,
    "Basic Facial": 1200,
    "Blow-Dry & Style": 500
};

bookingDate.min = new Date().toISOString().split("T")[0];
const selectedService = new URLSearchParams(window.location.search).get("service");
if (selectedService) {
    document.getElementById("serviceSelect").value = selectedService;
}
document.getElementById("bookingForm").addEventListener("submit", function(event){
    event.preventDefault();
    const service = document.getElementById("serviceSelect").value;
    const currentUser = JSON.parse(sessionStorage.getItem("blushCurrentUser") || "null");
    const bookings = JSON.parse(localStorage.getItem("blushBookings") || "[]");
    bookings.push({
        id: Date.now(),
        customer: document.getElementById("bookingName").value.trim(),
        email: currentUser ? currentUser.email : "",
        service: service,
        price: prices[service] || 0,
        date: bookingDate.value,
        time: document.getElementById("bookingTime").value,
        status: "Pending"
    });
    localStorage.setItem("blushBookings", JSON.stringify(bookings));
    event.target.reset();
    bookingDate.min = new Date().toISOString().split("T")[0];
    const notice = document.getElementById("bookingNotice");
    notice.textContent = "Your appointment has been submitted successfully. Status: Pending.";
    notice.hidden = false;
});
