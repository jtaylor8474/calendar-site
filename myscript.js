let now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let selectedDate = null;
        // let events = {};  // No longer local

        // Use localStorage for persistence
        let events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');


      function generateCalendar(year, month) {
            const monthYearDisplay = document.getElementById('month-year');
            const calendarBody = document.getElementById('calendar-body');
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            monthYearDisplay.textContent = monthNames[month] + " " + year;
            calendarBody.innerHTML = '';

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            let date = 1;
            for (let i = 0; i < 6; i++) {
                let row = document.createElement('tr');
                for (let j = 0; j < 7; j++) {
                    let cell = document.createElement('td');
                    if (i === 0 && j < startingDayOfWeek) {
                        cell.textContent = '';
                    } else if (date > daysInMonth) {
                        cell.textContent = '';
                    } else {
                        let dateNum = document.createTextNode(date);
                        cell.appendChild(dateNum);
                        let cellDate = new Date(year, month, date);
                        let dateStr = formatDate(cellDate);

                        cell.addEventListener('click', function() {
                            if (selectedDate) {
                                document.querySelector(`.calendar td.selected`)?.classList.remove('selected');
                            }
                            cell.classList.add('selected');
                            selectedDate = cellDate;
                            console.log("Selected Date:", selectedDate);

                            let eventName = prompt("Enter event name for " + dateStr + ":");
                            if (eventName) {
                                addEvent(dateStr, eventName);
                                displayEvents(cell, dateStr);
                            }
                        });

                        if (year === now.getFullYear() && month === now.getMonth() && date === now.getDate()) {
                            cell.classList.add('today');
                        }

                        displayEvents(cell, dateStr);
                        date++;
                    }
                    row.appendChild(cell);
                }
                calendarBody.appendChild(row);
                if (date > daysInMonth) {
                    break;
                }
            }
        }

        function formatDate(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        }

      function addEvent(dateStr, eventName) {
            if (!events[dateStr]) {
                events[dateStr] = [];
            }
            events[dateStr].push(eventName);
            saveEvents(); // Save to localStorage
        }

        function deleteEvent(dateStr, eventIndex) {
            events[dateStr].splice(eventIndex, 1);
            if (events[dateStr].length === 0) {
                delete events[dateStr];
            }
            saveEvents(); // Save to localStorage
            generateCalendar(currentYear, currentMonth);
        }

        function displayEvents(cell, dateStr) {
            cell.querySelectorAll('.event-container').forEach(e => e.remove());

            if (events[dateStr]) {
                events[dateStr].forEach((eventText, index) => {
                    let eventContainer = document.createElement('div');
                    eventContainer.classList.add('event-container');

                    let eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');
                    eventDiv.textContent = eventText;

                    let deleteBtn = document.createElement('button');
                    deleteBtn.classList.add('delete-event');
                    deleteBtn.textContent = 'x';
                    deleteBtn.addEventListener('click', function(event) {
                        event.stopPropagation();
                        deleteEvent(dateStr, index);
                    });

                    eventContainer.appendChild(eventDiv);
                    eventContainer.appendChild(deleteBtn);
                    cell.appendChild(eventContainer);
                });
            }
        }

        // Save events to localStorage
        function saveEvents() {
            localStorage.setItem('calendarEvents', JSON.stringify(events));
        }

        document.getElementById('prev-month').addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentYear, currentMonth);
        });

        document.getElementById('next-month').addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentYear, currentMonth);
        });

        generateCalendar(currentYear, currentMonth);  // Initial call
