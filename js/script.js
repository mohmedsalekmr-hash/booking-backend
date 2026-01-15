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
        btnGotIt: "Got it"
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
        btnGotIt: "حسناً"
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

    const TIME_SLOTS = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
    ];

    const timeHiddenInput = document.getElementById('time');
    const timeSlotsContainer = document.getElementById('time-slots-container');

    if (dateInput && timeSlotsContainer) {
        // Initialize Date
        const todayStr = new Date().toISOString().split('T')[0];
        dateInput.min = todayStr;

        if (!dateInput.value) dateInput.value = todayStr;

        // Trigger initial check
        checkAvailability();

        // Event Listener
        dateInput.addEventListener('change', checkAvailability);

        async function checkAvailability() {
            const selectedDate = dateInput.value;
            const lang = htmlElement.getAttribute('lang') || 'en';

            if (!selectedDate) {
                timeSlotsContainer.innerHTML = `<p class="slot-loading" data-i18n="msgSelectDate">${translations[lang].msgSelectDate}</p>`;
                return;
            }

            // Clear previous selection
            timeHiddenInput.value = '';
            // Show loading
            timeSlotsContainer.innerHTML = `<p class="slot-loading" data-i18n="msgChecking">${translations[lang].msgChecking}</p>`;

            try {
                // Fetch available slots from backend
                const response = await fetch(`${API_BASE_URL}/available-slots?date=${selectedDate}`);
                const data = await response.json();

                if (response.ok) {
                    renderSlots(data.availableSlots || [], lang);
                } else {
                    console.error("API Error:", data.error);
                    timeSlotsContainer.innerHTML = `<p class="slot-loading error">Error loading slots</p>`;
                }
            } catch (e) {
                console.error("Network Error:", e);
                timeSlotsContainer.innerHTML = `<p class="slot-loading error">Connection Error</p>`;
            }
        }

        function renderSlots(availableSlots, lang) {
            timeSlotsContainer.innerHTML = '';

            TIME_SLOTS.forEach(slot => {
                const btn = document.createElement('div');
                btn.classList.add('time-slot');
                btn.textContent = slot;

                // Check if slot is in available list
                // The API returns ["10:00", "11:00"] etc.
                if (availableSlots.includes(slot)) {
                    // AVAILABLE -> GREEN
                    btn.classList.add('available');
                    btn.onclick = function () {
                        const allSlots = timeSlotsContainer.querySelectorAll('.time-slot');
                        allSlots.forEach(el => el.classList.remove('selected'));

                        this.classList.add('selected');
                        timeHiddenInput.value = slot;
                        console.log("Selected:", slot);
                    };
                } else {
                    // UNAVAILABLE -> RED
                    btn.classList.add('booked');
                    btn.title = translations[lang].msgBookedTitle;
                    btn.innerHTML = `<span>${slot}</span>`; // Could add cross icon here
                }
                timeSlotsContainer.appendChild(btn);
            });
        }
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
            submitBtn.disabled = true;
            submitBtn.textContent = lang === 'ar' ? '...جاري الحجز' : 'Booking...';

            const formData = new FormData(bookingForm);
            const bookingData = {
                customer_name: formData.get('name'),
                phone_number: formData.get('phone'),
                service_name: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time'),
                // notes: formData.get('notes') // Backend doesn't store notes yet in DB schema, but we can send it
            };

            try {
                const response = await fetch(`${API_BASE_URL}/book-appointment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();

                if (response.status === 201) {
                    // Success!
                    bookingForm.style.display = 'none';
                    bookingSuccess.style.display = 'block';
                    bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Refresh slots to mark this one as taken immediately visualy if user stays
                    checkAvailability();

                } else if (response.status === 409) {
                    // Conflict (Double Booking or Limit)
                    alert(result.error);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;

                    // Specific handling: refresh slots if it was "Time slot already booked"
                    if (result.error.includes('booked')) {
                        checkAvailability();
                    }

                } else {
                    // Generic Error
                    throw new Error(result.error || "Unknown Error");
                }

            } catch (error) {
                console.error('Submission Error:', error);
                alert(lang === 'ar' ? 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' : 'Connection Error. Please try again.');
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
            if (dateInput) dateInput.valueAsDate = new Date();

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
            checkAvailability(); // Refresh slots for today
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
