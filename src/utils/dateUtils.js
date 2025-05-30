// src/utils/dateUtils.js

/**
 * Calculate total whole months between the given date and today.
 */
export const calcMonths = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  let months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());
  if (now.getDate() < d.getDate()) months--;
  return months >= 0 ? months : 0;
};

/**
 * Format a hire-date as “X yr. Y mo.” (or just “Y mo.” / “X yr.”)
 */
export const formatTenure = (dateStr) => {
  const total = calcMonths(dateStr);
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  let out = "";
  if (yrs > 0) out += `${yrs} yr.`;      // note the non-breaking space
  if (mos > 0) {
    if (out) out += " ";               // space before months
    out += `${mos} mo.`;
  }
  return out || "0 mo.";
};
