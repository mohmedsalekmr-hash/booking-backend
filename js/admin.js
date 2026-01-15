// --- CONFIGURATION ---
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://booking-backend-3nvh.onrender.com';

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
    if (apiSourceSelect) {
        apiSourceSelect.value = API_BASE_URL;
        updateSourceVisuals(API_BASE_URL);

        apiSourceSelect.addEventListener('change', () => {
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
    }
});
