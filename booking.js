const bookingDate = document.getElementById("bookingDate");
bookingDate.min = new Date().toISOString().split("T")[0];
const selectedService = new URLSearchParams(window.location.search).get("service");
if (selectedService) {
    document.getElementById("serviceSelect").value = selectedService;
}
document.getElementById("bookingForm").addEventListener("submit", function(event){
    event.preventDefault();
    const service = document.getElementById("serviceSelect").value;
    const bookings = JSON.parse(localStorage.getItem("blushBookings") || "[]");
    bookings.push({
        id: Date.now(),
        customer: document.getElementById("bookingName").value.trim(),
        email: "",
        service: service,
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
