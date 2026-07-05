// Mirrors backend/services/emailService.js formatCurrency so prices render
// identically in the UI and in emails.
export const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-LK')}`
