document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function(event) {
            event.preventDefault();

            let formData = new FormData(bookingForm);
            let newBooking = {
                name: formData.get("name"),
                contact: formData.get("contact"),
                grade: formData.get("grade"),
                design: formData.get("design") || "Custom Design Uploaded",
                date: formData.get("date"),
                time: formData.get("time"),
                status: "Prepped",
                customDesign: formData.get("customDesign") ? URL.createObjectURL(formData.get("customDesign")) : null
            };

            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
            bookings.push(newBooking);
            localStorage.setItem("bookings", JSON.stringify(bookings));

            alert("Booking recorded successfully!");
            bookingForm.reset();
        });
    }

    // Load bookings into the notes website
    if (document.getElementById("bookingTable")) {
        loadBookings();
    }
});

function loadBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let tableBody = document.querySelector("#bookingTable tbody");
    tableBody.innerHTML = "";

    bookings.forEach((booking, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.contact}</td>
            <td>${booking.grade}</td>
            <td>${booking.design}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>
                <button class="status-btn" onclick="updateStatus(${index}, 'Prepped')" style="background:black;">Prepped</button>
                <button class="status-btn" onclick="updateStatus(${index}, 'For Delivery')" style="background:yellow;">For Delivery</button>
                <button class="status-btn" onclick="updateStatus(${index}, 'Delivered')" style="background:green;">Delivered</button>
            </td>
            <td>${booking.customDesign ? `<img src="${booking.customDesign}" onclick="previewImage('${booking.customDesign}')">` : "None"}</td>
            <td><button onclick="deleteBooking(${index})">🗑 Delete</button></td>
        `;

        tableBody.appendChild(row);
    });
}

function updateStatus(index, newStatus) {
    let bookings = JSON.parse(localStorage.getItem("bookings"));
    bookings[index].status = newStatus;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadBookings();
}

function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem("bookings"));
    bookings.splice(index, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadBookings();
}

function previewImage(imageSrc) {
    let img = new Image();
    img.src = imageSrc;
    img.style.width = "80%";
    let newTab = window.open("");
    newTab.document.body.appendChild(img);
}

function searchBookings() {
    let searchValue = document.getElementById("searchBar").value.toLowerCase();
    let rows = document.querySelectorAll("#bookingTable tbody tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(searchValue) ? "" : "none";
    });
}
