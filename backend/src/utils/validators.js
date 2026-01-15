const isValidPhoneNumber = (phone) => {
    // Check if phone number is exactly 8 digits
    const regex = /^\d{8}$/;
    return regex.test(phone);
};

const isValidDate = (date) => {
    // Simple regex for YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

const isValidTime = (time) => {
    // Simple regex for HH:MM
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
};

module.exports = {
    isValidPhoneNumber,
    isValidDate,
    isValidTime
};
