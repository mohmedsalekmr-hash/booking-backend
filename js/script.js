// Translations
const translations = {
    en: {
        heroTitle: "Elevate Your Style.",
        heroSubtitle: "Experience master barbering. Book your grooming session in seconds.",
        bookBtn: "Secure Your Spot",
        bookNow: "Book Now",
        servicesTitle: "Crafted Grooming",
        servicesDesc: "Precision cuts and luxury treatments tailored for the modern gentleman.",
        service1Name: "Signature Haircut",
        service1Price: "300 MRU",
        service2Name: "The Royal Package",
        service2Price: "500 MRU",
        service3Name: "Ultimate Experience",
        service3Price: "800 MRU",
        howTitle: "Seamless Booking",
        step1Title: "Select Service",
        step1Desc: "Choose from our premium grooming menu.",
        step2Title: "Choose Time",
        step2Desc: "Find a slot that fits your lifestyle.",
        step3Title: "Confirmation",
        step3Desc: "Receive instant confirmation & reminders.",
        ctaTitle: "Ready for an Upgrade?",
        ctaDesc: "Join the elite. Book your appointment today.",
        phoneFn: "+222 12 34 56 78",
        rights: "All rights reserved.",
        whatsapp: "Concierge Chat",
        // Booking Form
        bookingTitle: "Secure Your Appointment",
        bookingDesc: "Please provide your details below.",
        labelName: "Full Name",
        labelPhone: "Phone Number (8 Digits)",
        labelService: "Selected Service",
        optionSelect: "Select Service...",
        labelDate: "Preferred Date",
        labelTime: "Preferred Time",
        optionSelectTime: "Select Time...",
        labelNotes: "Special Requests (Optional)",
        btnBookNow: "Confirm Booking",
        btnBack: "Book Another Service",
        placeholderName: "Enter your name",
        placeholderPhone: "e.g., 22334455",
        placeholderNotes: "Any specific style preferences?",
        errorPhone: "Please enter a valid 8-digit phone number.",
        successTitle: "Booking Confirmed",
        successDesc: "We look forward to welcoming you.",
        // Time Slot Messages
        msgSelectDate: "Please select a date first",
        msgChecking: "Checking availability...",
        msgFullyBooked: "Fully booked for this date",
        msgBookedTitle: "Booked",
        // Reminder Modal
        reminderTitle: "Reminder",
        reminderMsg: "You already have a booking for this day at:",
        reminderSub: "We look forward to seeing you!",
        btnGotIt: "Got it",
        labelRememberMe: "Remember my details"
    },
    ar: {
        heroTitle: "ارتقِ بمظهرك",
        heroSubtitle: "تجربة حلاقة فاخرة. احجز موعدك في ثوانٍ.",
        bookBtn: "احجز مكانك",
        bookNow: "احجز الآن",
        servicesTitle: "خدماتنا المتميزة",
        servicesDesc: "قصات دقيقة وعلاجات فاخرة مصممة للرجل العصري.",
        service1Name: "قصة مميزة",
        service1Price: "300 أوقية",
        service2Name: "الباقة الملكية",
        service2Price: "500 أوقية",
        service3Name: "التجربة الكاملة",
        service3Price: "800 أوقية",
        howTitle: "حجز سلس",
        step1Title: "اختر الخدمة",
        step1Desc: "اختر من قائمة العناية المتميزة لدينا.",
        step2Title: "اختر الوقت",
        step2Desc: "جد موعداً يناسب جدول حياتك.",
        step3Title: "تأكيد",
        step3Desc: "احصل على تأكيد فوري وتذكير.",
        ctaTitle: "جاهز للتغيير؟",
        ctaDesc: "انضم للنخبة. احجز موعدك اليوم.",
        phoneFn: "+222 12 34 56 78",
        rights: "جميع الحقوق محفوظة.",
        whatsapp: "محادثة فورية",
        // Booking Form
        bookingTitle: "تأكيد الحجز",
        bookingDesc: "يرجى ملء بياناتك أدناه.",
        labelName: "الاسم الكامل",
        labelPhone: "رقم الهاتف (8 أرقام)",
        labelService: "الخدمة المختارة",
        optionSelect: "اختر الخدمة...",
        labelDate: "اليوم المفضل",
        labelTime: "الوقت المفضل",
        optionSelectTime: "اختر الوقت...",
        labelNotes: "طلبات خاصة (اختياري)",
        btnBookNow: "تأكيد الحجز",
        btnBack: "حجز خدمة أخرى",
        placeholderName: "أدخل اسمك",
        placeholderPhone: "مثال: 22334455",
        placeholderNotes: "أي تفضيلات خاصة للقصة؟",
        errorPhone: "يرجى إدخال رقم هاتف صحيح (8 أرقام).",
        successTitle: "تم تأكيد الحجز",
        successDesc: "نتطلع للترحيب بك.",
        // Time Slot Messages
        msgSelectDate: "يرجى اختيار التاريخ أولاً",
        msgChecking: "جاري التحقق من المواعيد...",
        msgFullyBooked: "لا توجد مواعيد متاحة في هذا اليوم",
        msgBookedTitle: "محجوز",
        // Reminder Modal
        reminderTitle: "تذكير",
        reminderMsg: "لديك حجز مؤكد بالفعل في هذا اليوم الساعة:",
        reminderSub: "نتطلع لرؤيتك!",
        btnGotIt: "حسناً",
        labelRememberMe: "تذكر بياناتي"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    const newBookingBtn = document.getElementById('new-booking-btn');

    const htmlElement = document.documentElement;
    const bodyArgs = document.body.classList;

    // Mobile Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuToggle && navMenu && navOverlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('nav-active');
            navOverlay.classList.toggle('active');
            bodyArgs.toggle('no-scroll'); // Prevent background scrolling
        });

        navOverlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('nav-active');
            navOverlay.classList.remove('active');
            bodyArgs.remove('no-scroll');
        });

        // Close menu/overlay when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('nav-active');
                navOverlay.classList.remove('active');
                bodyArgs.remove('no-scroll');
            });
        });
    }

    // Load Remembered Details
    const savedName = localStorage.getItem('savedName');
    const savedPhone = localStorage.getItem('savedPhone');
    const rememberMeCheckbox = document.getElementById('remember-me');

    if (savedName && savedPhone) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');

        if (nameInput) nameInput.value = savedName;
        if (phoneInput) phoneInput.value = savedPhone;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }

    // Auto-fill Date with Today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        dateInput.value = todayStr;
        dateInput.min = todayStr;
    }

    // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        bodyArgs.add('dark-mode');
        bodyArgs.remove('light-mode');
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        bodyArgs.add('light-mode');
        bodyArgs.remove('dark-mode');
        htmlElement.setAttribute('data-theme', 'light');
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

    // Language Logic
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = htmlElement.getAttribute('lang');
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });

    function setLanguage(lang) {
        // Update Flatpickr Locale if exists
        const dateInput = document.getElementById('date');
        if (dateInput && dateInput._flatpickr) {
            dateInput._flatpickr.set('locale', lang === 'ar' ? 'ar' : 'default');
        }

        htmlElement.setAttribute('lang', lang);
        htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update Text Content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Check if explicitly heading/paragraph/label/button to safe update
                if (!['INPUT', 'TEXTAREA'].includes(el.tagName)) {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update Placeholders Explicitly
        const elName = document.getElementById('name');
        if (elName) elName.placeholder = translations[lang].placeholderName;

        const elPhone = document.getElementById('phone');
        if (elPhone) elPhone.placeholder = translations[lang].placeholderPhone;

        const elNotes = document.getElementById('notes');
        if (elNotes) elNotes.placeholder = translations[lang].placeholderNotes;



        // Update Toggle Text
        langToggle.textContent = lang === 'en' ? 'AR' : 'EN';

        localStorage.setItem('lang', lang);
    }

    // --- CONFIGURATION ---
    const API_BASE_URL = 'https://booking-backend-3nvh.onrender.com';
    let slotsCache = {}; // Simple in-memory cache

    const TIME_SLOTS = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
    ];

    const timeHiddenInput = document.getElementById('time');
    const timeSlotsContainer = document.getElementById('time-slots-container');

    // --- TOAST NOTIFICATION SYSTEM ---
    function showToast(title, message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-msg">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Animate In
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 5s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 5000);
    }

    // Helper Functions
    async function checkAvailability() {
        if (!dateInput || !timeSlotsContainer) return;

        const selectedDate = dateInput.value;
        const lang = htmlElement.getAttribute('lang') || 'en';

        if (!selectedDate) {
            timeSlotsContainer.innerHTML = `<p class="slot-loading" data-i18n="msgSelectDate">${translations[lang].msgSelectDate}</p>`;
            return;
        }

        // Check Cache
        if (slotsCache[selectedDate]) {
            renderSlots(slotsCache[selectedDate].availableSlots, slotsCache[selectedDate].breakSlots || [], lang);
            return;
        }

        // Clear previous selection
        timeHiddenInput.value = '';

        // Show loading with spinner (only if not cached)
        const loadingText = translations[lang].msgChecking;
        timeSlotsContainer.innerHTML = `
            <div class="slot-loading">
                <div class="spinner slot-spinner"></div>
                <div style="margin-top: 10px;">${loadingText}</div>
            </div>
        `;

        try {
            // Fetch available slots from backend
            const response = await fetch(`${API_BASE_URL}/available-slots?date=${selectedDate}`);

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            const data = await response.json();

            // Update Cache
            slotsCache[selectedDate] = {
                availableSlots: data.availableSlots || [],
                breakSlots: data.breakSlots || []
            };

            renderSlots(data.availableSlots || [], data.breakSlots || [], lang);

        } catch (e) {
            console.error("Network Error:", e);
            const errorMsg = lang === 'ar' ? 'فشل الاتصال بالخادم' : 'Connection Failed';
            timeSlotsContainer.innerHTML = `<p class="slot-loading error">⚠️ ${errorMsg}</p>`;
        }
    }

    function renderSlots(availableSlots, breakSlots, lang) {
        if (!timeSlotsContainer) return;
        timeSlotsContainer.innerHTML = '';

        const isFullyBooked = availableSlots.length === 0;
        // Don't show fully booked if there are breaks (technically breaks aren't "booked") 
        // but for user purpose, if no available slots, it is fully booked.

        if (availableSlots.length === 0) {
            timeSlotsContainer.innerHTML = `<p class="slot-loading error" data-i18n="msgFullyBooked">${translations[lang].msgFullyBooked}</p>`;
            return;
        }

        TIME_SLOTS.forEach(slot => {
            const btn = document.createElement('div');
            btn.classList.add('time-slot');
            btn.textContent = slot;

            // Check if slot is in available list
            if (availableSlots.includes(slot)) {
                // AVAILABLE -> GREEN
                btn.classList.add('available');
                btn.onclick = function () {
                    const allSlots = timeSlotsContainer.querySelectorAll('.time-slot');
                    allSlots.forEach(el => el.classList.remove('selected'));

                    this.classList.add('selected');
                    timeHiddenInput.value = slot;

                    // Visual feedback
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => this.style.transform = '', 100);
                };
            } else if (breakSlots && breakSlots.includes(slot)) {
                // BREAK -> YELLOW
                btn.classList.add('break');
                btn.title = lang === 'ar' ? 'استراحة' : 'Break';
                btn.innerHTML = `<span>${slot}</span>`;
            } else {
                // UNAVAILABLE -> RED
                btn.classList.add('booked');
                btn.title = translations[lang].msgBookedTitle;
                btn.innerHTML = `<span>${slot}</span>`;
            }
            timeSlotsContainer.appendChild(btn);
        });
    }

    if (dateInput && timeSlotsContainer) {
        // Initialize Flatpickr
        const isRTL = htmlElement.getAttribute('dir') === 'rtl';

        flatpickr(dateInput, {
            minDate: "today",
            dateFormat: "Y-m-d",
            defaultDate: "today",
            disableMobile: true,
            locale: isRTL ? 'ar' : 'default',
            onChange: function (selectedDates, dateStr, instance) {
                checkAvailability();
            }
        });

        // Trigger initial check
        checkAvailability();
    }

    // Phone Validation Helper
    function validatePhone(phone) {
        // Regex: Exactly 8 digits
        const regex = /^\d{8}$/;
        return regex.test(phone);
    }

    // Form Submission Logic
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Validate Time Selection
            const timeValue = timeHiddenInput.value;
            const lang = htmlElement.getAttribute('lang') || 'en';

            if (!timeValue || timeValue.trim() === "") {
                const msg = lang === 'ar' ? 'يرجى اختيار الوقت المناسب من القائمة' : 'Please select a preferred time slot.';
                timeSlotsContainer.classList.add('input-error');
                setTimeout(() => { timeSlotsContainer.classList.remove('input-error'); }, 500);
                timeSlotsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast(lang === 'ar' ? 'تنبيه' : 'Alert', msg, 'info');
                return;
            }

            // 2. Validate Phone
            const phoneInput = document.getElementById('phone');
            const phoneError = document.getElementById('phone-error');
            const phoneNumber = phoneInput.value.trim();

            if (!validatePhone(phoneNumber)) {
                phoneInput.classList.add('input-error');
                phoneError.textContent = translations[lang].errorPhone;
                phoneError.style.display = 'block';
                setTimeout(() => { phoneInput.classList.remove('input-error'); }, 500);
                return;
            } else {
                phoneInput.classList.remove('input-error');
                phoneInput.classList.remove('error');
                phoneError.style.display = 'none';
            }



            // 3. SUBMIT TO BACKEND
            const submitBtn = bookingForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;

            // Disable Button & Show Spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<div class="spinner"></div> ${lang === 'ar' ? 'جاري الحجز...' : 'Booking...'}`;

            const formData = new FormData(bookingForm);
            const bookingData = {
                customer_name: formData.get('name'),
                phone_number: formData.get('phone'),
                service_name: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time')
            };

            try {
                // Network Checks
                if (!navigator.onLine) {
                    throw new Error("No Internet Connection");
                }

                // Timeout Controller (45 seconds)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 45000);

                const response = await fetch(`${API_BASE_URL}/book-appointment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                    signal: controller.signal
                });

                clearTimeout(timeoutId); // Clear timeout on response

                const result = await response.json();

                if (response.status === 201) {
                    // Success!

                    // Save to LocalStorage if Checked
                    const rememberMe = document.getElementById('remember-me');
                    if (rememberMe && rememberMe.checked) {
                        localStorage.setItem('savedName', bookingData.customer_name);
                        localStorage.setItem('savedPhone', bookingData.phone_number);
                    } else {
                        localStorage.removeItem('savedName');
                        localStorage.removeItem('savedPhone');
                    }
                    bookingForm.style.display = 'none';
                    bookingSuccess.style.display = 'block';
                    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    showToast(lang === 'ar' ? 'نجاح' : 'Success', translations[lang].successTitle, 'success');

                    // Refresh slots and clear cache
                    slotsCache = {};
                    checkAvailability();

                } else if (response.status === 409) {
                    // Conflict
                    let errorMsg;
                    if (result.existingTime) {
                        errorMsg = lang === 'ar'
                            ? `لديك حجز مسبق اليوم الساعة ${result.existingTime}`
                            : `You already booked today at ${result.existingTime}`;
                    } else {
                        errorMsg = result.error || (lang === 'ar' ? 'هذا الموعد محجوز ط مسبقاً' : 'This slot is already booked');
                    }

                    // Clear Cache on conflict to force refresh
                    slotsCache = {};

                    showToast(lang === 'ar' ? 'خطأ' : 'Error', errorMsg, 'error');

                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;

                    if (result.error && result.error.includes('booked')) {
                        checkAvailability();
                    }

                } else {
                    // Generic Server Error
                    throw new Error(result.error || `Server Error (${response.status})`);
                }

            } catch (error) {
                console.error('Submission Error:', error);

                let errorTitle = lang === 'ar' ? 'خطأ' : 'Error';
                let errorMsg = error.message;

                if (errorMsg === 'Failed to fetch' || errorMsg === 'No Internet Connection') {
                    errorMsg = lang === 'ar' ? 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.' : 'Network error or server timeout. Please try again.';
                } else if (error.name === 'AbortError') {
                    errorMsg = lang === 'ar' ? 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.' : 'Request timed out. Please try again.';
                } else if (errorMsg.includes('Server Error')) {
                    errorMsg = lang === 'ar' ? 'خطأ في الخادم.' : 'Server error. Please try again.';
                }

                showToast(errorTitle, errorMsg, 'error');

                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Reset Form (Book Another)
    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', () => {
            bookingForm.reset();
            // Reset date to today
            if (dateInput && dateInput._flatpickr) {
                dateInput._flatpickr.setDate("today");
            } else if (dateInput) {
                dateInput.valueAsDate = new Date();
            }

            // Clear slot selection
            timeHiddenInput.value = '';
            document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));

            bookingForm.style.display = 'grid'; // Re-show form
            bookingSuccess.style.display = 'none'; // Hide success

            // Clear errors
            const phoneInput = document.getElementById('phone');
            const phoneError = document.getElementById('phone-error');
            if (phoneInput) phoneInput.classList.remove('error');
            if (phoneError) phoneError.style.display = 'none';

            // Refresh slots
            checkAvailability();
        });
    }

    // Scroll Animations (Using the new fade-in-up class)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is consistently visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .hero-image');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Glass Card Hover Effect Logic (Optional Enhancement)
    // We can add distinct visual flair on JS selection for service cards too
});

// Smart Booking Logic (Global Scope)
function selectService(serviceName) {
    const serviceSelect = document.getElementById('service');
    const bookingSection = document.getElementById('booking');

    if (serviceSelect) {
        serviceSelect.value = serviceName;

        // Find matching option to ensure value is correct (robustness)
        // If exact match isn't found, it defaults to what's gathered
    }

    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}
