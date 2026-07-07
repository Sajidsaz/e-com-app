// Mirrors backend/services/emailService.js formatCurrency so prices render
// identically in the UI and in emails.
export const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-LK')}`

// Sale-aware pricing. A product is on sale when salePrice is a positive number
// below its regular price. Mirrors the server's effectivePrice logic.
export const getEffectivePrice = (product) => {
    const price = Number(product?.price) || 0
    const sale = Number(product?.salePrice)
    const onSale = product?.salePrice != null && !isNaN(sale) && sale > 0 && sale < price
    return {
        price: onSale ? sale : price, // what the customer actually pays
        original: price,
        onSale,
        percentOff: onSale ? Math.round((1 - sale / price) * 100) : 0,
    }
}
