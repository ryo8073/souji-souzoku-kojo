/**
 * Formats a number as Japanese Yen currency.
 * @param {number} number - The number to format.
 * @returns {string} The formatted currency string.
 */
window.formatCurrency = function(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0円';
    }
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(number);
};

/**
 * Formats a number with commas as thousands separators.
 * @param {number} number - The number to format.
 * @returns {string} The formatted number string.
 */
window.formatNumber = function(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0';
    }
    return new Intl.NumberFormat('ja-JP').format(number);
}; 