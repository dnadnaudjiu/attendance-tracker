const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load attendance data
const loadAttendance = () => {
    const data = fs.readFileSync("database.json");
    return JSON.parse(data);
};

// Save attendance data
const saveAttendance = (data) => {
    fs.writeFileSync("database.json", JSON.stringify(data, null, 4));
};

// Endpoint to get attendance history
app.get("/attendance", (req, res) => {
    const data = loadAttendance();
    res.json(data);
});

// Endpoint to save new attendance record
app.post("/attendance", (req, res) => {
    const { date, attendance } = req.body;
    let data = loadAttendance();

    data.attendance.push({ date, attendance });
    saveAttendance(data);

    res.json({ message: "Attendance saved!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
