// utils/dateFormatter.js

/**
 * Formats a date into "Month DD, YYYY at HH:MM AM/PM" format
 * @param {Date|string|number} date - Date object, timestamp, or date string
 * @returns {string} Formatted date string
 * @throws {Error} If date is invalid
 */
const formatMessageDateTime = (date) => {
  try {
    // Convert input to Date object if it isn't already
    const dateObject = new Date(date);

    // Check if date is valid
    if (isNaN(dateObject.getTime())) {
      throw new Error('Invalid date provided');
    }

    // Format the date using Intl.DateTimeFormat for better localization support
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const formattedDate = dateFormatter.format(dateObject);
    const formattedTime = timeFormatter.format(dateObject);

    return `${formattedDate} at ${formattedTime}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    throw error;
  }
};

module.exports = formatMessageDateTime;
