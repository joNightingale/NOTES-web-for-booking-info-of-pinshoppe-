
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let bookings = [];

// Load bookings from file
if (fs.existsSync('bookings.json')) {
    bookings = JSON.parse(fs.readFileSync('bookings.json', 'utf-8'));
}

// Verify Admin
app.post('/verify-admin', (req, res) => {
    const { password } = req.body;
    if (password === "sodium_chloride") {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Get all bookings
app.get('/bookings', (req, res) => {
    res.json(bookings);
});

// Update booking status
app.post('/update-status', (req, res) => {
    const { index, status } = req.body;
    bookings[index].status = status;
    fs.writeFileSync('bookings.json', JSON.stringify(bookings));
    res.json({ success: true });
});

// Delete a booking
app.post('/delete-booking', (req, res) => {
    const { index } = req.body;
    bookings.splice(index, 1);
    fs.writeFileSync('bookings.json', JSON.stringify(bookings));
    res.json({ success: true });
});

// Clear all bookings
app.post('/clear-bookings', (req, res) => {
    bookings = [];
    fs.writeFileSync('bookings.json', JSON.stringify(bookings));
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
