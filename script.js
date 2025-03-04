document.addEventListener("DOMContentLoaded", () => {
    const studentNames = ["איתן", "יניב", "דניל", "דניאלה","אנה","שלי","דוד","יאריק","אושר","ליאל","אלה","נורין","לארין","האדי","נסטיה","יובל","תאיר","ארז","לירון","אנטון","לינוי","דניאל .ר.","דניאל .מ.","עופרי","שי","מריאנה","תאיה","סיידה","עדן","ליאם","אלירן"];
    const attendanceList = document.getElementById("attendance-list");
    const currentDate = new Date().toLocaleDateString();
    document.getElementById("current-date").textContent = currentDate;

    studentNames.forEach(name => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" id="${name}" /> ${name}`;
        attendanceList.appendChild(li);
    });

    loadHistory();
});

// Function to format the date as DD/MM/YY
function formatDate() {
    const date = new Date(); // Get current date

    let day = date.getDate(); // Day of the month (1-31)
    let month = date.getMonth() + 1; // Month (0-11), so we add 1
    let year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year

    // Add leading zero if day or month is a single digit
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    // Return formatted date: DD/MM/YY
    return `${day}/${month}/${year}`;
}

async function submitAttendance() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    let attendanceData = [];

    checkboxes.forEach(checkbox => {
        attendanceData.push({ name: checkbox.id, present: checkbox.checked });
    });

    const today = formatDate(); // Use formatDate to get the formatted date
    
    await fetch("http://localhost:3000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, attendance: attendanceData }),
    });

    loadHistory();
}

async function loadHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // Clear the history list before reloading

    const response = await fetch("http://localhost:3000/attendance");
    const data = await response.json();

    // Loop through each attendance record and display it
    data.attendance.forEach(record => {
        const li = document.createElement("li");

        // Use formatDate() to ensure the date is displayed in the correct format (DD/MM/YY)
        const formattedDate = formatDate();

        // Display the attendance history with formatted date and present/absent count
        li.textContent = `${formattedDate} - נוכחים: ${record.attendance.filter(a => a.present).length}, חסרים: ${record.attendance.filter(a => !a.present).length}`;
        
        historyList.appendChild(li);
    });
}

window.onload = function() {
    formatDate();
};