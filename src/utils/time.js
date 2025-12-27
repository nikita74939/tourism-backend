/**
 * Time utilities for timezone conversion
 */

/**
 * Convert UTC to WIB (UTC+7)
 */
const toWIB = (date) => {
  const utcDate = new Date(date);
  const wibOffset = 7 * 60; // WIB is UTC+7
  const localOffset = utcDate.getTimezoneOffset();
  const wibTime = new Date(utcDate.getTime() + (wibOffset + localOffset) * 60000);
  return wibTime;
};

/**
 * Convert WIB to UTC
 */
const toUTC = (date) => {
  const wibDate = new Date(date);
  const wibOffset = 7 * 60;
  const utcTime = new Date(wibDate.getTime() - wibOffset * 60000);
  return utcTime;
};

/**
 * Format date to readable string
 */
const formatDate = (date, includeTime = true) => {
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    })
  };
  return d.toLocaleString('id-ID', options);
};

/**
 * Check if date is in the past
 */
const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 */
const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Get difference in days between two dates
 */
const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = {
  toWIB,
  toUTC,
  formatDate,
  isPast,
  isFuture,
  getDaysDifference
};