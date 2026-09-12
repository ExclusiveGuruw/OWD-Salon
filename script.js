
const defaultUsers = [

    {
        name:"Salon Admin",
        email:"admin@owdsalon.ph",
        password:"admin123",
        role:"admin"
    },

    {
        name:"Demo Buyer",
        email:"buyer@owdsalon.ph",
        password:"buyer123",
        role:"buyer"
    }

];


const prices = {

    "Haircut & Blow-Dry":650,

    "Hair Color":1800,

    "Balayage":3200,

    "Hair Treatment":950,

    "Gel Manicure":700,

    "Gel Pedicure":850,

    "Brow Shaping":350,

    "Basic Facial":1200,

    "Blow-Dry & Style":500

};


function getUsers(){

    let users =
        JSON.parse(
            localStorage.getItem("blushUsers")
        );

    if(!users){

        localStorage.setItem(
            "blushUsers",
            JSON.stringify(defaultUsers)
        );

        users = defaultUsers;

    }

    return users;

}


function getBookings(){

    return JSON.parse(
        localStorage.getItem("blushBookings") || "[]"
    );

}


function saveBookings(bookings){

    localStorage.setItem(
        "blushBookings",
        JSON.stringify(bookings)
    );

}


function getCurrentUser(){

    return JSON.parse(
        sessionStorage.getItem("blushCurrentUser") || "null"
    );

}


function loginUser(user){

    sessionStorage.setItem(
        "blushCurrentUser",
        JSON.stringify(user)
    );

}


function logoutUser(){

    sessionStorage.removeItem(
        "blushCurrentUser"
    );

}


function money(amount){

    return new Intl.NumberFormat(
        "en-PH",
        {
            style:"currency",
            currency:"PHP"
        }
    ).format(amount);

}


function getBookingPrice(booking){

    const directPrice =
        Number(booking.price);

    if(Number.isFinite(directPrice) && directPrice >= 0){

        return directPrice;

    }

    if(booking.service && prices[booking.service]){

        return prices[booking.service];

    }

    return 0;

}


const authModal =
    document.getElementById("authModal");

const loginPanel =
    document.getElementById("loginPanel");

const registerPanel =
    document.getElementById("registerPanel");

const accountButton =
    document.getElementById("accountButton");

const logoutButton =
    document.getElementById("logoutButton");

const accountSection =
    document.getElementById("accountSection");

const adminSection =
    document.getElementById("adminSection");

const bookingForm =
    document.getElementById("bookingForm");

const bookingNotice =
    document.getElementById("bookingNotice");


function openLogin(){

    authModal.classList.remove("hidden");

    loginPanel.classList.remove("hidden");

    registerPanel.classList.add("hidden");

}


function closeLogin(){

    authModal.classList.add("hidden");

}


accountButton.addEventListener(
    "click",
    function(){

        const user =
            getCurrentUser();

        if(!user){

            openLogin();

            return;

        }

        if(user.role === "admin"){

            window.location.hash = "#adminSection";
            updateUI();

        }else{

            accountSection.scrollIntoView({
                behavior:"smooth"
            });

        }

    }
);


logoutButton.addEventListener(
    "click",
    function(){

        logoutUser();

        updateUI();

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }
);


document
.getElementById("closeModal")
.addEventListener(
    "click",
    closeLogin
);


authModal.addEventListener(
    "click",
    function(event){

        if(event.target === authModal){

            closeLogin();

        }

    }
);


document
.getElementById("registerButton")
.addEventListener(
    "click",
    function(){

        loginPanel.classList.add("hidden");

        registerPanel.classList.remove("hidden");

    }
);


document
.getElementById("loginButton")
.addEventListener(
    "click",
    function(){

        registerPanel.classList.add("hidden");

        loginPanel.classList.remove("hidden");

    }
);


document
.getElementById("loginForm")
.addEventListener(
    "submit",
    function(event){

        event.preventDefault();

        const email =
            document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const password =
            document
            .getElementById("loginPassword")
            .value;

        const users =
            getUsers();

        const user =
            users.find(
                function(u){

                    return (
                        u.email.toLowerCase() === email &&
                        u.password === password
                    );

                }
            );

        if(!user){

            alert(
                "Invalid email or password."
            );

            return;

        }

        loginUser(user);

        event.target.reset();

        closeLogin();

        updateUI();

        const homeSection =
            document.getElementById("home");

        if(homeSection){

            homeSection.scrollIntoView({
                behavior:"smooth"
            });

        }

    }
);


document
.getElementById("registerForm")
.addEventListener(
    "submit",
    function(event){

        event.preventDefault();

        const name =
            document
            .getElementById("registerName")
            .value
            .trim();

        const email =
            document
            .getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();

        const password =
            document
            .getElementById("registerPassword")
            .value;

        const users =
            getUsers();

        const alreadyExists =
            users.some(
                function(user){

                    return (
                        user.email.toLowerCase() ===
                        email
                    );

                }
            );

        if(alreadyExists){

            alert(
                "An account with that email already exists."
            );

            return;

        }

        const newUser = {

            name:name,

            email:email,

            password:password,

            role:"buyer"

        };

        users.push(newUser);

        localStorage.setItem(
            "blushUsers",
            JSON.stringify(users)
        );

        loginUser(newUser);

        event.target.reset();

        closeLogin();

        updateUI();

        accountSection.scrollIntoView({
            behavior:"smooth"
        });

    }
);


if(bookingForm){

    bookingForm.addEventListener(
        "submit",
        function(event){

            event.preventDefault();

            const user =
                getCurrentUser();

            if(!user || user.role !== "buyer"){

                if(bookingNotice){

                    bookingNotice.textContent =
                        "Please login using a buyer account before booking.";

                    bookingNotice.classList.remove(
                        "hidden"
                    );

                }

                openLogin();

                return;

            }


            const customer =
                document
                .getElementById("bookingName")
                .value
                .trim();

            const service =
                document
                .getElementById("serviceSelect")
                .value;

            const date =
                document
                .getElementById("bookingDate")
                .value;

            const time =
                document
                .getElementById("bookingTime")
                .value;


            const newBooking = {

                id:Date.now(),

                customer:customer,

                email:user.email,

                service:service,

                price:prices[service],

                date:date,

                time:time,

                status:"Pending"

            };


            const bookings =
                getBookings();

            bookings.push(newBooking);

            saveBookings(bookings);


            bookingForm.reset();


            if(bookingNotice){

                bookingNotice.textContent =
                    "Your appointment has been submitted successfully. Status: Pending.";

                bookingNotice.classList.remove(
                    "hidden"
                );

            }


            renderBuyerBookings();

            renderAdminBookings();

        }
    );

}


function renderBuyerBookings(){

    const user =
        getCurrentUser();

    if(!user || user.role !== "buyer"){

        return;

    }

    const bookings =
        getBookings()
        .filter(
            function(booking){

                return booking.email === user.email;

            }
        )
        .sort(
            function(a, b){

                return b.id - a.id;

            }
        );

    const totalBookings =
        bookings.length;

    const upcomingBookings =
        bookings.filter(
            function(booking){

                return (
                    booking.status !== "Completed" &&
                    booking.status !== "Cancelled"
                );

            }
        ).length;

    const completedBookings =
        bookings.filter(
            function(booking){

                return booking.status === "Completed";

            }
        ).length;

    const cancelledBookings =
        bookings.filter(
            function(booking){

                return booking.status === "Cancelled";

            }
        ).length;


    document
    .getElementById("userCard")
    .innerHTML = `

        <div class="account-dashboard">

            <div class="profile-card">

                <div class="profile-badge">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <div class="profile-meta">

                    <p class="small-title">
                        BUYER ACCOUNT
                    </p>

                    <h3>
                        ${user.name}
                    </h3>

                    <p class="profile-email">
                        ${user.email}
                    </p>

                </div>

            </div>

            <div class="account-actions">

                <a
                    href="booking.html"
                    class="primary-button small-button"
                >
                    Book an Appointment
                </a>

                <button
                    type="button"
                    class="secondary-button"
                    onclick="logoutUser(); updateUI(); window.scrollTo({top:0, behavior:'smooth'});"
                >
                    Logout
                </button>

            </div>

        </div>


        <div class="stats-grid">

            <div class="summary-tile">

                <span class="summary-label">
                    Total Bookings
                </span>

                <strong>
                    ${totalBookings}
                </strong>

            </div>

            <div class="summary-tile">

                <span class="summary-label">
                    Upcoming
                </span>

                <strong>
                    ${upcomingBookings}
                </strong>

            </div>

            <div class="summary-tile">

                <span class="summary-label">
                    Completed
                </span>

                <strong>
                    ${completedBookings}
                </strong>

            </div>

            <div class="summary-tile">

                <span class="summary-label">
                    Cancelled
                </span>

                <strong>
                    ${cancelledBookings}
                </strong>

            </div>

        </div>

    `;


    const container =
        document.getElementById(
            "buyerBookings"
        );


    if(bookings.length === 0){

        container.innerHTML = `

            <div class="booking-dashboard empty-state-card">

                <div class="empty-state">

                    <div class="empty-icon">
                        ✦
                    </div>

                    <h3>
                        No appointments yet
                    </h3>

                    <p>
                        Your salon bookings will appear here once you reserve a service.
                    </p>

                    <a
                        href="booking.html"
                        class="primary-button"
                    >
                        Book an Appointment
                    </a>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="booking-dashboard">

            <div class="recent-header">

                <div>

                    <p class="small-title">
                        RECENT BOOKINGS
                    </p>

                    <h3>
                        Your appointment history
                    </h3>

                </div>

                <span class="recent-count">
                    ${totalBookings} total
                </span>

            </div>

            <div class="recent-list">

                ${bookings
                    .map(
                        function(booking){

                            const statusClass =
                                (booking.status || "Pending")
                                .toLowerCase();

                            return `

                                <div class="booking-item">

                                    <div class="booking-main">

                                        <div class="booking-icon">
                                            ${booking.service.charAt(0)}
                                        </div>

                                        <div class="booking-copy">

                                            <strong>
                                                ${booking.service}
                                            </strong>

                                            <small>
                                                ${booking.date}
                                                at
                                                ${booking.time}
                                            </small>

                                            <small>
                                                ${money(getBookingPrice(booking))}
                                            </small>

                                        </div>

                                    </div>

                                    <div class="booking-side">

                                        <span class="status ${statusClass}">
                                            ${booking.status || "Pending"}
                                        </span>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("")}

            </div>

        </div>

    `;

}


function renderAdminBookings(){

    const user =
        getCurrentUser();

    if(!user || user.role !== "admin"){

        return;

    }


    const bookings =
        getBookings();

    const container =
        document.getElementById(
            "adminBookings"
        );


    if(bookings.length === 0){

        container.innerHTML = `

            <div class="user-card">

                <p>
                    No customer bookings yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        bookings
        .map(
            function(booking){

                return `

                    <div class="admin-booking">

                        <div class="admin-booking-info">

                            <strong>
                                ${booking.customer}
                            </strong>

                            <small>
                                ${booking.service}
                            </small>

                            <small>
                                ${booking.date}
                                at
                                ${booking.time}
                            </small>

                            <small>
                                ${booking.email}
                                •
                                ${money(getBookingPrice(booking))}
                            </small>

                        </div>


                        <div class="admin-actions">

                            <select
                                onchange="changeBookingStatus(
                                    ${booking.id},
                                    this.value
                                )"
                            >

                                <option
                                    ${booking.status === "Pending" ? "selected" : ""}
                                >
                                    Pending
                                </option>

                                <option
                                    ${booking.status === "Confirmed" ? "selected" : ""}
                                >
                                    Confirmed
                                </option>

                                <option
                                    ${booking.status === "Completed" ? "selected" : ""}
                                >
                                    Completed
                                </option>

                                <option
                                    ${booking.status === "Cancelled" ? "selected" : ""}
                                >
                                    Cancelled
                                </option>

                            </select>


                            <button
                                class="delete-button"
                                onclick="deleteBooking(${booking.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


function changeBookingStatus(
    id,
    newStatus
){

    const bookings =
        getBookings();

    const updated =
        bookings.map(
            function(booking){

                if(booking.id === id){

                    booking.status =
                        newStatus;

                }

                return booking;

            }
        );


    saveBookings(updated);

    renderAdminBookings();

    renderBuyerBookings();

}


function deleteBooking(id){

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this booking?"
        );

    if(!confirmDelete){

        return;

    }


    const bookings =
        getBookings()
        .filter(
            function(booking){

                return booking.id !== id;

            }
        );


    saveBookings(bookings);

    renderAdminBookings();

    renderBuyerBookings();

}


function updateUI(){

    const user =
        getCurrentUser();

    document.body.classList.toggle(
        "logged-in",
        Boolean(user)
    );

    document.body.classList.toggle(
        "admin-bookings-only",
        Boolean(
            user &&
            user.role === "admin" &&
            window.location.hash === "#adminSection"
        )
    );


    if(user){

        accountButton.classList.add(
            "hidden"
        );

        logoutButton.classList.remove(
            "hidden"
        );

    }else{

        accountButton.textContent =
            "Login";

        accountButton.classList.remove(
            "hidden"
        );

        logoutButton.classList.add(
            "hidden"
        );

    }


    const adminBookingLink =
        document.getElementById("adminBookingLink");

    if(adminBookingLink){

        adminBookingLink.classList.toggle(
            "hidden",
            !user || user.role !== "admin"
        );

    }


    if(user && user.role === "buyer"){

        accountSection.classList.remove(
            "hidden"
        );

        adminSection.classList.add(
            "hidden"
        );

        renderBuyerBookings();

    }else if(user && user.role === "admin"){

        const showAdminSection =
            window.location.hash === "#adminSection";

        adminSection.classList.toggle(
            "hidden",
            !showAdminSection
        );

        accountSection.classList.add(
            "hidden"
        );

        if(showAdminSection){

            renderAdminBookings();

        }

    }else{

        accountSection.classList.add(
            "hidden"
        );

        adminSection.classList.add(
            "hidden"
        );

    }

}


const today =
    new Date()
    .toISOString()
    .split("T")[0];

const bookingDateInput =
    document.getElementById("bookingDate");

if(bookingDateInput){

    bookingDateInput.min = today;

}


getUsers();

window.addEventListener(
    "hashchange",
    updateUI
);

updateUI();

