document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentDate = now.getDate();

    // Set Header Year dynamically
    document.getElementById("calendar-year").textContent = currentYear;

    const quartersContainer = document.getElementById("quarters-container");

    // Quarter definitions (Months grouped by 3)
    const quarters = [
        { name: "Quarter I", months: [0, 1, 2] },     // Jan, Feb, Mar
        { name: "Quarter II", months: [3, 4, 5] },    // Apr, May, Jun
        { name: "Quarter III", months: [6, 7, 8] },   // Jul, Aug, Sep
        { name: "Quarter IV", months: [9, 10, 11] }   // Oct, Nov, Dec
    ];

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

    let quartersHTML = "";

    quarters.forEach(quarter => {
        let monthsHTML = "";

        quarter.months.forEach(monthIndex => {
            const firstDay = new Date(currentYear, monthIndex, 1).getDay();
            const totalDays = new Date(currentYear, monthIndex + 1, 0).getDate();

            let tableRows = "";
            let dayCount = 1;

            // Build calendar grid rows
            for (let i = 0; i < 6; i++) {
                let row = "<tr>";
                let isRowEmpty = true;

                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        row += `<td class="empty"></td>`;
                    } else if (dayCount > totalDays) {
                        row += `<td class="empty"></td>`;
                    } else {
                        let isToday = (currentYear === now.getFullYear() && 
                                       monthIndex === currentMonth && 
                                       dayCount === currentDate);
                        
                        let className = isToday ? "today" : "";
                        row += `<td class="${className}">${dayCount}</td>`;
                        dayCount++;
                        isRowEmpty = false;
                    }
                }
                row += "</tr>";

                // Stop creating unnecessary empty trailing rows
                if (!isRowEmpty) {
                    tableRows += row;
                }
            }

            // Build mini table headers for days
            let dayHeaders = dayNames.map(d => `<th>${d}</th>`).join("");

            monthsHTML += `
                <div class="month-block">
                    <h3>${monthNames[monthIndex]}</h3>
                    <table class="month-table">
                        <thead><tr>${dayHeaders}</tr></thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            `;
        });

        quartersHTML += `
            <div class="quarter-card">
                <h2 class="quarter-title">${quarter.name}</h2>
                <div class="months-container">
                    ${monthsHTML}
                </div>
            </div>
        `;
    });

    quartersContainer.innerHTML = quartersHTML;
});
