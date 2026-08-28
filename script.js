
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

            adminSection.scrollIntoView({
                behavior:"smooth"
            });

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

        window.location.href = "index.html#home";

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


bookingForm.addEventListener(
    "submit",
    function(event){

        event.preventDefault();

        const user =
            getCurrentUser();

        if(!user || user.role !== "buyer"){

            bookingNotice.textContent =
                "Please login using a buyer account before booking.";

            bookingNotice.classList.remove(
                "hidden"
            );

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


        bookingNotice.textContent =
            "Your appointment has been submitted successfully. Status: Pending.";

        bookingNotice.classList.remove(
            "hidden"
        );


        renderBuyerBookings();

        renderAdminBookings();

    }
);


function renderBuyerBookings(){

    const user =
        getCurrentUser();

    if(!user || user.role !== "buyer"){

        return;

    }


    document
    .getElementById("userCard")
    .innerHTML = `

        <h3>
            Welcome, ${user.name}
        </h3>

        <p>
            ${user.email}
        </p>

    `;


    const bookings =
        getBookings()
        .filter(
            function(booking){

                return booking.email === user.email;

            }
        );


    const container =
        document.getElementById(
            "buyerBookings"
        );


    if(bookings.length === 0){

        container.innerHTML = `

            <div class="user-card">

                <p>
                    You don't have any appointments yet.
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

                    <div class="booking-item">

                        <div>

                            <strong>
                                ${booking.service}
                            </strong>

                            <small>
                                ${booking.date}
                                at
                                ${booking.time}
                            </small>

                            <small>
                                ${money(booking.price)}
                            </small>

                        </div>

                        <span class="status">
                            ${booking.status}
                        </span>

                    </div>

                `;

            }
        )
        .join("");

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
                                â€¢
                                ${money(booking.price)}
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


    if(user && user.role === "buyer"){

        accountSection.classList.remove(
            "hidden"
        );

        adminSection.classList.add(
            "hidden"
        );

        renderBuyerBookings();

    }else if(user && user.role === "admin"){

        adminSection.classList.remove(
            "hidden"
        );

        accountSection.classList.add(
            "hidden"
        );

        renderAdminBookings();

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

document
.getElementById("bookingDate")
.min = today;


getUsers();

updateUI();

