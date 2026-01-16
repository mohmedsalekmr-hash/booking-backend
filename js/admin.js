// --- CONFIGURATION ---
const savedSource = localStorage.getItem('api_source_override');
const API_BASE_URL = savedSource || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:3000'
    : 'https://booking-backend-3nvh.onrender.com');

// --- Helper Functions ---
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function isToday(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const bookingsBody = document.getElementById('bookings-body');
    const filterDate = document.getElementById('filter-date');
    const resetFilterBtn = document.getElementById('reset-filter');
    const exportBtn = document.getElementById('export-csv');
    const themeToggle = document.getElementById('theme-toggle');
    const apiSourceSelect = document.getElementById('api-source');
    const bodyArgs = document.body.classList;
    const htmlElement = document.documentElement;

    // State
    let allBookings = [];

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        bodyArgs.add('dark-mode');
        bodyArgs.remove('light-mode');
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        if (bodyArgs.contains('light-mode')) {
            bodyArgs.replace('light-mode', 'dark-mode');
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            bodyArgs.replace('dark-mode', 'light-mode');
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- API Source Indicator ---
    // --- API Source Indicator ---
    if (apiSourceSelect) {
        // Set initial value based on what was resolved
        apiSourceSelect.value = API_BASE_URL;
        updateSourceVisuals(API_BASE_URL);

        apiSourceSelect.addEventListener('change', () => {
            // Persist selection
            localStorage.setItem('api_source_override', apiSourceSelect.value);
            window.location.reload();
        });
    }

    function updateSourceVisuals(url) {
        const isLocal = url.includes('localhost');
        const statusColor = isLocal ? '#f39c12' : '#2ecc71';
        if (apiSourceSelect) apiSourceSelect.style.borderColor = statusColor;
    }

    // --- Fetch Data ---
    async function fetchBookings() {
        // Show loading state
        bookingsBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Loading from ${API_BASE_URL}...</td></tr>`;

        try {
            // Cache-busting to prevent 404 caching from previous deployments
            const response = await fetch(`${API_BASE_URL}/bookings?_t=${Date.now()}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.bookings) {
                allBookings = data.bookings;
                renderTable(allBookings);
            } else {
                renderTable([]);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            const isLocal = API_BASE_URL.includes('localhost');
            const targetUrl = `${API_BASE_URL}/bookings`;

            // Try to diagnose if it's just the route or the whole server
            let healthStatus = "Unknown";
            try {
                const h = await fetch(`${API_BASE_URL}/health`);
                healthStatus = h.status;
            } catch (e) { healthStatus = "Unreachable"; }

            bookingsBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color: #e74c3c; padding: 2rem;">
                        <strong>Connection Failed</strong><br>
                        <small>Target: ${targetUrl}</small><br>
                        <small>Status: ${error.message}</small><br>
                        <small>Server Health: ${healthStatus}</small><br>
                        <button onclick="fetchBookings()" style="margin-top:1rem; padding:0.5rem 1rem; border:1px solid currentColor; background:transparent; color:inherit; cursor:pointer;">Retry</button>
                    </td>
                </tr>`;
        }
    }

    // --- Render Table ---
    function renderTable(data) {
        bookingsBody.innerHTML = '';

        if (data.length === 0) {
            bookingsBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No bookings found</td></tr>`;
            return;
        }

        const today = new Date();
        data.forEach(booking => {
            const bookingDate = new Date(booking.date);
            const isUpcoming = bookingDate >= today;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(booking.date)} <br> <span class="status-badge ${isUpcoming ? 'upcoming' : ''}">${isToday(booking.date) ? 'Today' : ''}</span></td>
                <td><span style="font-weight: 600; color: var(--gold-primary);">${booking.time}</span></td>
                <td>${booking.customer_name}</td>
                <td>${booking.service_name}</td>
                <td>${booking.phone_number}</td>
                <td>
                    <button class="btn btn-outline" onclick="deleteBooking(${booking.id})" style="padding: 4px 8px; font-size: 0.8rem; border-color: #e74c3c; color: #e74c3c;">
                        Delete
                    </button>
                </td>
            `;
            bookingsBody.appendChild(tr);
        });
    }

    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings');
    const settingsForm = document.getElementById('settings-form');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            fetchSettings();
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(settingsForm);
            const data = Object.fromEntries(formData.entries());

            // Basic Validation
            if (data.opening_time >= data.closing_time && data.closing_time !== '00:00') {
                alert('Closing time must be after opening time (or 00:00 for midnight).');
                return;
            }
            if (data.break_start >= data.break_end) {
                alert('Break end time must be after break start time.');
                return;
            }
            // Removed strict validation for break within working hours to allow custom break slots
            // if (data.break_start < data.opening_time || data.break_end > data.closing_time) { ... }

            try {
                const response = await fetch(`${API_BASE_URL}/settings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Settings saved successfully!');
                    settingsModal.classList.remove('active');
                    // Optional: Reload to apply changes if they affect current view (not really needed for admin table, but good practice)
                    location.reload();
                } else {
                    throw new Error('Failed to save settings');
                }
            } catch (error) {
                console.error('Error saving settings:', error);
                alert('Error saving settings. Please try again.');
            }
        });
    }

    async function fetchSettings() {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`);
            if (!response.ok) throw new Error('Failed to fetch settings');
            const settings = await response.json();

            // Populate form
            for (const [key, value] of Object.entries(settings)) {
                const input = settingsForm.elements[key];
                if (input) {
                    input.value = value;
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            alert('Failed to load current settings.');
        }
    }

    // --- Filter Logic ---
    function filterData() {
        const selectedDate = filterDate.value;

        let filtered = allBookings;

        if (selectedDate) {
            filtered = allBookings.filter(b => b.date === selectedDate);
        }

        renderTable(filtered);
    }

    filterDate.addEventListener('change', filterData);

    resetFilterBtn.addEventListener('click', () => {
        filterDate.value = '';
        renderTable(allBookings);
    });

    // --- Export CSV ---
    function downloadCSV() {
        if (allBookings.length === 0) {
            alert("No data to export");
            return;
        }

        // CSV Header
        const headers = ["ID", "Customer Name", "Phone", "Service", "Date", "Time", "Created At"];

        // CSV Rows
        const rows = allBookings.map(b => [
            b.id,
            `"${b.customer_name}"`, // Quote strings with spaces
            b.phone_number,
            `"${b.service_name}"`,
            b.date,
            b.time,
            b.created_at
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        // Create Blob and Link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `barber_bookings_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', downloadCSV);
    }

    // Initial Load
    fetchBookings();
});

// --- Delete Booking Logic ---
window.deleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        alert('Booking deleted successfully');
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Error deleting booking');
    }
};

// --- Add Booking Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Modal Elements
    const modalOverlay = document.getElementById('modal-overlay');
    const openBtn = document.getElementById('add-booking-btn');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('add-booking-form');

    if (openBtn && modalOverlay) {
        openBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            modalOverlay.style.display = 'block'; // Ensure visibility
        });
    }

    if (closeBtn && modalOverlay) {
        closeBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            modalOverlay.style.display = 'none';
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const bookingData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/book-appointment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to book');
                }

                alert('Booking added successfully!');
                modalOverlay.classList.remove('active');
                modalOverlay.style.display = 'none';
                form.reset();
                window.location.reload();

            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });


        // --- Smart Slot Picker Logic for Admin ---
        const adminDateInput = form.querySelector('input[name="date"]');
        const adminTimeHidden = document.getElementById('admin-time-input');
        const adminSlotsContainer = document.getElementById('admin-time-slots');

        async function checkAdminAvailability() {
            const selectedDate = adminDateInput.value;
            if (!selectedDate) {
                adminSlotsContainer.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding:1rem;">Please select a date first</p>';
                return;
            }

            adminSlotsContainer.innerHTML = '<p style="text-align:center; padding:1rem;">Checking availability...</p>';

            try {
                const response = await fetch(`${API_BASE_URL}/available-slots?date=${selectedDate}`);
                const data = await response.json();
                renderAdminSlots(data.slots || []);
            } catch (error) {
                console.error(error);
                adminSlotsContainer.innerHTML = '<p style="text-align:center; color:#e74c3c;">Error fetching slots</p>';
            }
        }

        function renderAdminSlots(slots) {
            adminSlotsContainer.innerHTML = '';

            const availableSlots = slots.filter(s => s.status === 'available');

            if (availableSlots.length === 0) {
                adminSlotsContainer.innerHTML = '<p style="text-align:center; color:#e74c3c; padding:1rem;">Fully Booked</p>';
                return;
            }

            availableSlots.forEach(slot => {
                const slotEl = document.createElement('div');
                slotEl.className = 'time-slot available';
                slotEl.textContent = slot.time;

                slotEl.onclick = () => {
                    // Remove selected from others
                    adminSlotsContainer.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
                    // Add to current
                    slotEl.classList.add('selected');
                    // Update hidden input
                    adminTimeHidden.value = slot.time;
                };

                adminSlotsContainer.appendChild(slotEl);
            });
        }

        if (adminDateInput) {
            // Set min date to today
            adminDateInput.min = new Date().toISOString().split('T')[0];

            adminDateInput.addEventListener('change', checkAdminAvailability);
        }
    }
});
