document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    // Set Header Year dynamically
    document.getElementById("calendar-year").textContent = currentYear;

    const quartersContainer = document.getElementById("quarters-container");

    const quarters = [
        { name: "Quarter I", months: [0, 1, 2] },
        { name: "Quarter II", months: [3, 4, 5] },
        { name: "Quarter III", months: [6, 7, 8] },
        { name: "Quarter IV", months: [9, 10, 11] }
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
                        // Store full date string data attribute for interactive clicking
                        row += `<td class="${className}" data-year="${currentYear}" data-month="${monthIndex}" data-day="${dayCount}">${dayCount}</td>`;
                        dayCount++;
                        isRowEmpty = false;
                    }
                }
                row += "</tr>";

                if (!isRowEmpty) {
                    tableRows += row;
                }
            }

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
            <div class="quarter-section">
                <h2 class="quarter-title">${quarter.name}</h2>
                <div class="months-row">
                    ${monthsHTML}
                </div>
            </div>
        `;
    });

    quartersContainer.innerHTML = quartersHTML;

    // --- Interactive Date Click & Modal Logic ---
    const modal = document.getElementById("date-modal");
    const closeModal = document.getElementById("close-modal");
    const modalTitle = document.getElementById("modal-date-title");
    const modalNotes = document.getElementById("modal-notes");
    const saveNotesBtn = document.getElementById("save-notes");

    let selectedCell = null;
    let savedNotesData = JSON.parse(localStorage.getItem("calendar_notes") || "{}");

    document.querySelectorAll(".month-table td:not(.empty)").forEach(cell => {
        cell.addEventListener("click", (e) => {
            if (selectedCell) selectedCell.classList.remove("selected");
            selectedCell = e.target;
            selectedCell.classList.add("selected");

            const y = selectedCell.getAttribute("data-year");
            const m = parseInt(selectedCell.getAttribute("data-month"));
            const d = selectedCell.getAttribute("data-day");

            const dateKey = `${y}-${m}-${d}`;
            const formattedDateStr = `${monthNames[m]} ${d}, ${y}`;

            modalTitle.textContent = formattedDateStr;
            modalNotes.value = savedNotesData[dateKey] || "";
            modal.classList.add("active");
        });
    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });

    saveNotesBtn.addEventListener("click", () => {
        if (selectedCell) {
            const y = selectedCell.getAttribute("data-year");
            const m = selectedCell.getAttribute("data-month");
            const d = selectedCell.getAttribute("data-day");
            const dateKey = `${y}-${m}-${d}`;

            savedNotesData[dateKey] = modalNotes.value;
            localStorage.setItem("calendar_notes", JSON.stringify(savedNotesData));
            
            saveNotesBtn.textContent = "Saved!";
            setTimeout(() => {
                saveNotesBtn.textContent = "Save Note";
                modal.classList.remove("active");
            }, 600);
        }
    });
});
