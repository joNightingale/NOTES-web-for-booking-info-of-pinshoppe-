let isAdmin = false;
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let archivedBookings = JSON.parse(localStorage.getItem("archivedBookings")) || [];
let visitorIPs = JSON.parse(localStorage.getItem("visitorIPs")) || [];

function showPasswordInput() {
    document.getElementById("password-section").classList.remove("hidden");
}

function verifyAdmin() {
    let password = document.getElementById("adminPassword").value;
    if (password === "sodium_chloride") {
        isAdmin = true;
        document.getElementById("login").classList.add("hidden");
        document.getElementById("main-content").classList.remove("hidden");
        document.getElementById("adminActions").classList.remove("hidden");
        document.getElementById("clearBtn").classList.remove("hidden");
        document.getElementById("adminMenu").classList.remove("hidden");
        loadBookings();
    } else {
        document.getElementById("error-message").classList.remove("hidden");
    }
}

function setMode(mode) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    loadBookings();
}

function loadBookings() {
    let bookingList = document.getElementById("bookingList");
    bookingList.innerHTML = "";

    bookings.forEach((booking, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${booking.name}</td>
                         <td>${booking.contact}</td>
                         <td>${booking.grade}</td>
                         <td>${booking.design ? 'Design ' + booking.design : 'Custom'}</td>
                         <td>${booking.customDesign ? `<img src="${booking.customDesign}" width="50" height="50" onclick="openImage('${booking.customDesign}')">` : 'None'}</td>
                         <td>${booking.date}</td>
                         <td>${booking.time}</td>
                         <td>${booking.status}</td>
                         ${isAdmin ? `<td>
                             <select onchange="updateStatus(${index}, this.value)">
                                 <option value="Being Made" ${booking.status === "Being Made" ? "selected" : ""}>Being Made</option>
                                 <option value="Preparing" ${booking.status === "Preparing" ? "selected" : ""}>Preparing</option>
                                 <option value="Delivering" ${booking.status === "Delivering" ? "selected" : ""}>Delivering</option>
                                 <option value="Delivered" ${booking.status === "Delivered" ? "selected" : ""}>Delivered</option>
                             </select>
                             <button onclick="deleteBooking(${index})">🗑 Delete</button>
                         </td>` : ''}`;
        bookingList.appendChild(row);
    });
}

function updateStatus(index, status) {
    bookings[index].status = status;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadBookings();
}

function deleteBooking(index) {
    bookings.splice(index, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadBookings();
}

function clearBookings() {
    bookings = [];
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadBookings();
}

// Back button functionality
function goBack() {
    isAdmin = false;
    document.getElementById("adminPassword").value = "";
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
    document.getElementById("adminMenu").classList.add("hidden");
}

function toggleMenu() {
    document.querySelector('.menu-toggle').classList.toggle('open');
    // Toggle admin menu visibility
    if (isAdmin) {
        document.getElementById("adminMenu").classList.toggle("hidden");
    }
}

function trackIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            visitorIPs.push(data.ip);
            localStorage.setItem("visitorIPs", JSON.stringify(visitorIPs));
            alert(`IP Address ${data.ip} tracked.`);
        });
}

function archiveBookings() {
    archivedBookings = bookings.map(booking => ({ ...booking, archived: true }));
    localStorage.setItem("archivedBookings", JSON.stringify(archivedBookings));
    alert("Bookings have been archived.");
}

// Modal functionality
document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = {
        name: document.getElementById("name").value.trim(),
        contact: document.getElementById("contact").value.trim(),
        grade: document.getElementById("grade").value.trim(),
        design: document.getElementById("design").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        customDesign: document.getElementById("customDesign").files[0] ? URL.createObjectURL(document.getElementById("customDesign").files[0]) : null
    };

    if (!formData.name || !formData.contact || !formData.grade || !formData.date || !formData.time) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!formData.design && !formData.customDesign) {
        alert("Please select a design or upload a custom design.");
        return;
    }

    // Delete duplicate if exists
    bookings = bookings.filter(booking => 
        !(booking.name === formData.name &&
          booking.contact === formData.contact &&
          booking.grade === formData.grade &&
          booking.date === formData.date &&
          booking.time === formData.time)
    );

    bookings.push(formData);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Show the modal
    let modal = document.getElementById("thankYouModal");
    modal.style.display = "block";

    // Close the modal when the user clicks on <span> (x)
    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});
